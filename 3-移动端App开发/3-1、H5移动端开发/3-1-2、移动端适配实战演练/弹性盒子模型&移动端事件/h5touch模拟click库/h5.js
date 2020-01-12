(function(global) {
  var myMobile = function(selector) {
    return myMobile.prototype._init(selector);
  };

  myMobile.prototype = {
    ele: null,
    _init(selector) {
      if (typeof selector === "string") {
        // 查找元素存到原型对象中
        this.ele = document.querySelector(selector);
      }
      // 返回原型对象
      return this;
    },
    // 单击
    tap(handler) {
      var startTime, endTime;
      function _touchFn(e) {
        e.preventDefault();
        switch (e.type) {
          case "touchstart":
            startTime = new Date().getTime();
            break;
          case "touchend":
            endTime = new Date().getTime();
            if (endTime - startTime < 200) {
              handler.call(this, e);
            }
            break;
          default:
            break;
        }
      }
      this.ele.addEventListener("touchstart", _touchFn);
      this.ele.addEventListener("touchend", _touchFn);
    },
    // 长按
    longTap(handler) {
      var time;
      function _touchFn(e) {
        e.preventDefault();
        switch (e.type) {
          case "touchstart":
            time = setTimeout(() => {
              handler.call(this, e);
            }, 500);
            break;
          case "touchmove":
            clearTimeout(time);
            break;
          case "touchend":
            clearTimeout(time);
          default:
            break;
        }
      }
      this.ele.addEventListener("touchstart", _touchFn);
      this.ele.addEventListener("touchmove", _touchFn);
      this.ele.addEventListener("touchend", _touchFn);
    },
    // 左滑
    leftSlide(handler) {
      var startX, startY, endX, endY;
      function _touchFn(e) {
        e.preventDefault();
        var touched = e.changedTouches[0];
        switch (e.type) {
          case "touchstart":
            startX = touched.pageX;
            startY = touched.pageY;
            break;
          case "touchend":
            endX = touched.pageX;
            endY = touched.pageY;
            if (
              Math.abs(endX - startX) > Math.abs(endY - startY) &&
              Math.abs(endX - startX) > 20
            ) {
              handler.call(this, e);
            }
            break;
          default:
            break;
        }
      }
      this.ele.addEventListener("touchstart", _touchFn);
      this.ele.addEventListener("touchend", _touchFn);
    }
  };

  global.$ = global.myMobile = myMobile;
})(window);
