export default class View {
  #btnInit = document.querySelector('#init')
  #statusElement = document.querySelector('#status')
  #videoFrameCanvas = document.createElement('canvas')
  #canvasContext = this.#videoFrameCanvas.getContext('2d', { willReadFrequently: true })
  #videoElement = document.querySelector('#video')

  //Transformando video em uma imagem.

  getVideoFrame(video) {
    //Não podemos passar um elemento html para o worker thread, precisamos passar os dados para a web cam
    //Converter pra um canvas o obj html que n é um video, para assim obtermos os dados

    const canvas = this.#videoFrameCanvas
    const [width, height] = [video.videoWidth, video.videoHeight]

    //Setando o tamanho do canvas
    canvas.width = width
    canvas.height = height

  //Pegando o video e plotar o frame daquele tempo numa imagem e retornando o get image data    
    this.#canvasContext.drawImage(video, 0, 0, width, height)
    return this.#canvasContext.getImageData(0, 0, width, height)
  }
  togglePlayVideo() {
    //Significa que precisa dar o play
    if (this.#videoElement.paused) {
      this.#videoElement.play()
      return
    }

    //Usa o mesmo elemento pra dar o pause
    this.#videoElement.pause()
  }
  enableButton() {
    this.#btnInit.disabled = false
  }

  configureOnBtnClick(fn) {
    this.#btnInit.addEventListener('click', fn)
  }
  log(text) {
    this.#statusElement.innerHTML = text
  }
}