import { knownGestures, gestureStrings } from '../util/util.js'

export default class HandGestureService {
  #gestureEstimator
  #handPoseDetection
  #handsVersion
  #detector = null //Para garantir que nunca vai ter cash
  #gestureStrings

  constructor({ fingerpose, handPoseDetection, handsVersion, gestureStrings }) {
    this.#gestureEstimator = new fingerpose.GestureEstimator(knownGestures)
    this.#handPoseDetection = handPoseDetection
    this.#handsVersion = handsVersion
    this.#gestureStrings = gestureStrings
  }

  //Vai receber os dados do TensorFlow e manipulá-los
  async estimate(keypoints3D) {
    const predictions = await this.#gestureEstimator.estimate(
      this.#getLandMarksFromKeypoints(keypoints3D),
      // porcentagem de confiança do gesto (90%)
      9
    )
    return predictions.gestures
  }

  //assinc interator, assim que for lendo os dados ja vai ser enviado para quem chamou
  async *detectGestures(predictions) {
    //Para cada mão que o tensorflow retornar, vamos passar para o nosso objeto
    for (const hand of predictions) {
      //Validando a existencia de mão na camera
      if (!hand.keypoints3D) continue
      //Criando gestos para renderizar com keypoint3D
      const gestures = await this.estimate(hand.keypoints3D)

      //Validando se existe gestos
      if (!gestures.length) continue

      //Pegando os gestos com maiores score
      const result = gestures.reduce((previous, current) =>
        previous.score > current.score ? previous : current
      )

      //Detectando a posição da mão
      const { x, y } = hand.keypoints.find(
        keypoint => keypoint.name === 'index_finger_tip'
      )

      //Usando o iterator para
      yield { event: result.name, x, y }

      //Indicando qual mão está sendo detectada
      console.log('detected', this.#gestureStrings[result.name])
    }
    //
  }

  //Conversão
  #getLandMarksFromKeypoints(keypoints3D) {
    return keypoints3D.map(keypoint => [keypoint.x, keypoint.y, keypoint.z])
  }

  //Função para detectar a mão
  async estimateHands(video) {
    return this.#detector.estimateHands(video, {
      flipHorizontal: true
    })
  }

  async initializeDetector() {
    //Se o detector tiver dado, chama direto, se não so seta o valor do mesmo
    if (this.#detector) return this.#detector

    const detectorConfig = {
      runtime: 'mediapipe',
      solutionPath:
        //Fixar uma versão pois o google pode alterar sua versão e ter problema de compatibilidade.
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
      //O full é o mais pesado e o mais preciso
      //O lite é o mais leve, e gasta pouca memoria
      modelType: 'lite',
      //Maximo de mãos 2, pode haver mais de uma pessoa na frente da camera
      maxHands: 2
    }

    this.#detector = await this.#handPoseDetection.createDetector(
      this.#handPoseDetection.SupportedModels.MediaPipeHands,
      detectorConfig
    )
    return this.#detector
  }
}
