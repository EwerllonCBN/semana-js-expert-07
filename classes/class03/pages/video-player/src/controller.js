export default class Controller {
  #view
  #camera
  #worker
  #blinkCounter = 0
  constructor({ view, worker, camera }) {
    this.#view = view
    this.#camera = camera
    this.#worker = this.#configureWorker(worker)

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('not yet detecting eye blink! click in the button to start')
    return controller.init()
  }

  #configureWorker(worker) {
    let ready = false
    worker.onmessage = ({ data }) => {
      if ('READY' === data) {
        console.log('worker is ready!')
        this.#view.enableButton()
        ready = true
        return
      }
      const blinked = data.blinked
      this.#blinkCounter += blinked
      this.#view.togglePlayVideo()
      console.log('blinked', blinked)
    }

    return {
      send(msg) {
        if (!ready) return
        worker.postMessage(msg)
      }
    }
  }
  async init() {
    console.log('init!!')
  }
    //Apos clicar no botão start, será chamado o loop
  //

  loop() {
    //Leitura da webcam
    const video = this.#camera.video
    //Tira print da webcam
    const img = this.#view.getVideoFrame(video)

     //Mandando o print para o worker e a cada 100 milisegundos ele repete o processo
    this.#worker.send(img)
    this.log(`detecting eye blink...`)
    setTimeout(() => this.loop(), 100)
  }
  log(text) {
    const times = `      - blinked times: ${this.#blinkCounter}`
    this.#view.log(`status: ${text}`.concat(this.#blinkCounter ? times : ""))
  }

  onBtnStart() {
    this.log('initializing detection...')
    this.#blinkCounter = 0

    //chama o loop ao clicar no start
    this.loop()
  }
}