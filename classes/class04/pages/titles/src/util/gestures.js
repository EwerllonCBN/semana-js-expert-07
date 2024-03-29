const { GestureDescription, Finger, FingerCurl } = window.fp

const ScrollDownGesture = new GestureDescription('scroll-down') // ✊️
const ScrollUpGesture = new GestureDescription('scroll-up') // 🖐
const ClickGesture = new GestureDescription('click') // 🤏🏻
const SearchGesture = new GestureDescription('search') // 🤘
const BackGesture = new GestureDescription('back') // ✌🏻

// Scroll Down
// -----------------------------------------------------------------------------

// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0)
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.6)

// all other fingers: curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0)
  ScrollDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9)
}

// ScrollUp
// -----------------------------------------------------------------------------

// no finger should be curled
for (let finger of Finger.all) {
  ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0)
}

// Click
// -----------------------------------------------------------------------------
ClickGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 0.8)
ClickGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 0.5)

ClickGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)
ClickGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.4)

ClickGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.9)

ClickGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 1.0)
ClickGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 0.9)

// Search
// -----------------------------------------------------------------------------
SearchGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 0.9)

SearchGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.9)
SearchGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5)

SearchGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.9)
SearchGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.5)

SearchGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.9)
SearchGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.5)

SearchGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 0.9)
SearchGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.5)

// Back
// -----------------------------------------------------------------------------
BackGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 0.9)

BackGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.9)
BackGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5)

BackGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.5)
BackGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 0.9)

BackGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 0.9)
BackGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.5)

BackGesture.addCurl(Finger.Pinky, FingerCurl.NoCurl, 0.9)
BackGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.5)

const knownGestures = [
  ScrollDownGesture,
  ScrollUpGesture,
  ClickGesture,
  SearchGesture
]

const gestureStrings = {
  'scroll-up': '🖐',
  'scroll-down': '✊️',
  click: '🤏🏻',
  search: '🤘',
  back: '✌🏻'
}

export { knownGestures, gestureStrings }
