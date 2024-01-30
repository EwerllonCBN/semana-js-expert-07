import { prepareRunChecker } from '../../../../lib/shared/util.js'

//Ele so pode rodar a cada 200 milisegundos, para evitar rolar, e clicar 10 mil vezes
const { shouldRun: scrollShouldRun } = prepareRunChecker({ timerDelay: 200 })
const { shouldRun: clickShouldRun } = prepareRunChecker({ timerDelay: 400 })
export default class HandGestureController {
  #view
  #service
  #camera
  //Para saber onde estava da ultima vez a posição
  #lastDirection = {
    direction: '',
    y: 0
  }
  constructor({ view, service, camera }) {
    this.#service = service
    this.#view = view
    this.#camera = camera
  }

  async init() {
    return this.#loop()
  }

  //Função para somar o scroll da tela conforme a posição da mão não hora da detecção

  #scrollPage(direction) {
    const pixelsPerScroll = 90
    if (this.#lastDirection.direction === direction) {
      this.#lastDirection.y =
        direction === 'scroll-down'
          ? this.#lastDirection.y + pixelsPerScroll
          : this.#lastDirection.y - pixelsPerScroll
    } else {
      this.#lastDirection.direction = direction
    }

    this.#view.scrollPage(this.#lastDirection.y)
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video)
      this.#view.clearCanvas()
      if (hands?.length) this.#view.drawResults(hands)
      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        //Evento de click
        if (event === 'click') {
          //Se o click está dentro de 200 milisegundos continue...
          if (!clickShouldRun()) continue
          //Se elemento for click, então pega o elemento keypoint x, y
          this.#view.clickOnElement(x, y)
          continue //continue para a proxima iteração
        }
        if (event.includes('scroll')) {
          //Não vai executar ai mais do que 200 milisegundos
          if (!scrollShouldRun()) continue
          this.#scrollPage(event)
        }
      }
    } catch (error) {
      console.error('deu ruim**', error)
    }
  }
  async #loop() {
    await this.#service.initializeDetector()
    await this.#estimateHands()
    this.#view.loop(this.#loop.bind(this))
  }

  static async initialize(deps) {
    const controller = new HandGestureController(deps)
    return controller.init()
  }
}
