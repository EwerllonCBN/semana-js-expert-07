export default class HandGestureView {
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
