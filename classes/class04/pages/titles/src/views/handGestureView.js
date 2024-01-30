export default class HandGestureView {
  #handsCanvas = document.querySelector('#hands')
  #canvasContext = this.#handsCanvas.getContext('2d')
  #fingerLookupIndexes
  #styler
  constructor({ fingerLookupIndexes, styler }) {
    this.#handsCanvas.width = globalThis.screen.availWidth
    this.#handsCanvas.height = globalThis.screen.availHeight
    this.#fingerLookupIndexes = fingerLookupIndexes
    this.#styler = styler

    //Carrega os estilos assincronamente
    //Para evitar travar a tela enquanto carrega
    setTimeout(() => styler.loadDocumentStyles(), 200)
  }

  clearCanvas() {
    this.#canvasContext.clearRect(
      0,
      0,
      this.#handsCanvas.width,
      this.#handsCanvas.height
    )
  }

  drawResults(hands) {
    for (const { keypoints, handedness } of hands) {
      if (!keypoints) continue
      //Cor dos pontos das mãos para cliques
      this.#canvasContext.fillStyle = handedness === 'Left' ? 'red' : 'green'
      //Cor das linhas da mão
      this.#canvasContext.strokeStyle = 'green'
      //Tamanho da linha das mãos
      this.#canvasContext.lineWidth = 8
      //linhas arredondadas
      this.#canvasContext.lineJoin = 'round'

      //Juntas
      this.#drawJoinents(keypoints)
      //Dedos
      this.#drawFingersAndHoverElements(keypoints)
    }
  }

  //Função para desenhar as juntas da mão

  #drawJoinents(keypoints) {
    //Pegando as coordenadas do keypoints
    for (const { x, y } of keypoints) {
      this.#canvasContext.beginPath() // Começando a escrever no canvas

      const newX = x - 2 //Retirando 2 px para as pontas dos dedos
      const newY = y - 2
      const radius = 3 //O quanto estara arredondado
      const startAngle = 0 //Angulo de inicio
      const endAngle = 2 * Math.PI //angulo de fim

      //Desenhando no canvas e imprimindo
      this.#canvasContext.arc(newX, newY, radius, startAngle, endAngle)
      this.#canvasContext.fill()
    }
  }

  //Função de click para cada keypoint

  clickOnElement(x, y) {
    //Capturando o elemento atravez do html
    const element = document.elementFromPoint(x, y)
    if (!element) return //Se não encontrou nada retorna

    //Clicando pra valer no elemento

    const rect = element.getBoundingClientRect()

    //Pegando o x, y do dedo, e alinhando com x, y do que encontramos no elemento
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: rect.left + x,
      clientY: rect.top + y
    })

    //Disparando o evento de click
    element.dispatchEvent(event)
  }

  focusSearch() {
    window.SmoothScroll('search')
    let input = document.getElementById('inputSearch')
    if (input) input.focus()
  }

  #drawFingersAndHoverElements(keypoints) {
    const fingers = Object.keys(this.#fingerLookupIndexes)

    for (const finger of fingers) {
      //Trazendo os pontos pra esse finger como array
      const points = this.#fingerLookupIndexes[finger].map(
        index => keypoints[index]
      )
      const region = new Path2D()
      //[0] é a palma da mão (wrist)
      const [{ x, y }] = points
      region.moveTo(x, y)
      for (const point of points) {
        region.lineTo(point.x, point.y)
      }
      this.#canvasContext.stroke(region)
      this.#hoverElement(finger, points)
    }
  }

  #hoverElement(finger, points) {
    //Se o finger for diferente da ponta do dedo retorna
    if (finger !== 'indexFinger') return

    //Pega a ponta do dedo.
    const tip = points.find(item => item.name === 'index_finger_tip')
    const element = document.elementFromPoint(tip.x, tip.y)
    if (!element) return
    const fn = () => this.#styler.toggleStyle(element, ':hover')
    fn()
    setTimeout(() => fn(), 500)
  }

  loop(fn) {
    //API para executar a função em 60 fps
    requestAnimationFrame(fn)
  }

  scrollPage(top) {
    scroll({
      top,
      behavior: 'smooth'
    })
  }
}
