
var volumeObj = {
  _vol: 0.3,
  
  get value () {
    return this._vol
  },
  set value(val) {
    this._vol = val
    audio.volume = val
  }
}

var progressObj = {
  _pro: 0,

  get value () {
    return this._pro
  },
  set value (val) {
    this._pro = val
    audio.currentTime = audio.duration * val
  }
}

/* 检查是否引入了slider.js */
if (typeof(slider) === 'function') {

  slider('progress-btn', 'progress', 'x', progressObj)

} 
else {
  console.log('slider.js should import first!')
}


/* 
 * 操作音量按钮
 */

let volumeSlide = document.querySelector('.volume-wrapper'),
         volume = document.querySelector('.volume')
      
// 音量条的hover      
volume.addEventListener('click', function() {
  if (getComputedStyle(volumeSlide).visibility === 'hidden') {
    volumeSlide.style.visibility = "visible"

    // 音量对应的slider组件
    slider('volume-btn', 'volume-slider', 'y', volumeObj)
  
  } else {  
    volumeSlide.style.visibility = "hidden"
  }
})



let audio = document.querySelector('audio'),
     play = document.querySelector('#play'),
     time = document.querySelector('#time'),
     cover = document.querySelector('.cover') ,
     progress = document.querySelector('.progress'),
     progressBtn = document.querySelector('.progress-btn')
     fullWidth = progress.parentElement.getBoundingClientRect().width
   
play.addEventListener('click', toggle)

audio.addEventListener('timeupdate', function() {
  
  current = secToMin(audio.currentTime)
  duration = secToMin(audio.duration)
  time.textContent = `${current}/${duration}`

  let progressBtnWidth = progressBtn.getBoundingClientRect().width,
           playedWidth = fullWidth * (audio.currentTime/ audio.duration)
  
  progress.style.width = playedWidth + "px"
  progressBtn.style.left = playedWidth - progressBtnWidth / 2 + "px"
})

// play pause toggle
function toggle () {
  if (!audio) {
    return false 
  }
  
  if (this.className === 'play') {
    this.className = 'pause' 
    audio.play()
    cover.style.animationPlayState = "running"
  } else {
    this.className = 'play'
    audio.pause()
    cover.style.animationPlayState = "paused" 
  }
}


// 时间格式转换
function secToMin (secs) {
  if(secs <= 0) {
    return false
  }

  if (secs < 60) {
    return  secs < 10? `00:0${parseInt(secs)}` : `00:${parseInt(secs)}`
  }

  let min = parseInt(secs / 60),
      sec = parseInt(secs - min * 60)
  
  if (sec < 10) {
    sec = `0${sec}`
  }
  return min > 9 ? `${min}:${sec}` : `0${min}:${sec}`
} 