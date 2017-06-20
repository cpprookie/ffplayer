// watchObj 用来实现进度变换的监听
function slider (itemClass, progressClass, slideDirection, watchObj) {
  let item = document.querySelector(`.${itemClass}`),
      progress = document.querySelector(`.${progressClass}`)

  if (!(item && progress)) {
    console.log('Wrong class names!')
    return false
  }

  if(watchObj.hasOwnProperty('value')) {
    var watchObj = watchObj
  } else {
    var watchObj = {
      _val: 0,

      get value() {
        return this._val
      },
      set value(val) {
        return this._val
      }
    }
  }

  let container = item.parentElement,
      containerPos = container.getBoundingClientRect() 
    
   /* 函数访问另一函数内部变量的情况，所以把moveAt直接写进onmousedown的回调函数作用域中 */
  item.onmousedown = function (event) {

    let direction = slideDirection === 'undefined'? 'x' : slideDirection.toLowerCase() 
    
    let itemPos = this.getBoundingClientRect()

    if (direction === 'y') {

      var shiftY = itemPos.bottom - event.pageY

      var topLimit = containerPos.top,   //鼠标在container 上滑动的极限区间
             
          bottomLimit = containerPos.bottom,
              
          leftLimit = containerPos.left - 20,
           
          rightLimit = containerPos.right + 30
    } 
    
    else {

      var shiftX = event.pageX - itemPos.left

      var rightLimit = containerPos.right,   //鼠标在container 上滑动的极限区间
             
          leftLimit = containerPos.left,
              
          topLimit = containerPos.top - 20,
           
          bottomLimit = containerPos.bottom + 30
    }

    item.limit = {
      rightLimit: rightLimit,
      leftLimit: leftLimit,
      topLimit: topLimit,
      bottomLimit: bottomLimit,
      shiftX: shiftX,
      shiftY: shiftY,
      direction: direction
    }

    document.addEventListener('mousemove', onMousemove)

    function onMousemove (event) {
      moveAt(event, item, progress, watchObj)
    }

   // 避免 mousemove事件中 Mouse离开container 导致mouseup无法监听
    function rmListener () {
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', rmListener)
      return false
    }
    
    document.addEventListener('mouseup', rmListener)
  }

}

function moveAt(event, item, progress, obj) {
  let pageX = event.pageX,
      pageY = event.pageY

  let dir = item.limit.direction,
      topLimit = item.limit.topLimit,
      rightLimit = item.limit.rightLimit,
      bottomLimit = item.limit.bottomLimit,
      leftLimit = item.limit.leftLimit

  let shiftX = item.limit.shiftX,
      shiftY = item.limit.shiftY

  let watchObj = obj

  if (dir === 'x') {

    if (pageY < topLimit || pageY > bottomLimit) {
      return false
    }

    if (pageX < rightLimit && pageX > leftLimit) {
      let distance = pageX - leftLimit

      item.style.left = distance - shiftX + "px"
      progress.style.width = distance + 'px'
      
      watchObj.value = distance / (rightLimit - leftLimit)
    }

  } else {

    if (pageX < leftLimit || pageX > rightLimit) {
      return false
    }

    if (pageY > topLimit && pageY < bottomLimit) {
      let distance = bottomLimit - pageY

      item.style.bottom = distance - shiftY + "px"
      progress.style.height = distance + 'px'
      
      watchObj.value = distance / (bottomLimit - topLimit)
    }
  }
}