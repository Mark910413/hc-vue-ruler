class Ruler {
  constructor(options) {
    this.ver = '1.0.0';
    this.options = options;

    this.pixelRatio = window.devicePixelRatio || 1;
    this.options.scaleplate = this.options.scaleplate === undefined ? {} : this.options.scaleplate;
    this.options.scaleplate.color = this.options.scaleplate.color === undefined ? '#f00' : this.options.scaleplate.color; // 刻度颜色
    this.options.scaleplate.width = (this.options.scaleplate.width === undefined ? 1 : this.options.scaleplate.width) * this.pixelRatio; // 刻度宽度
    this.options.scaleplate.fontsize = (this.options.scaleplate.fontsize === undefined ? 12 : this.options.scaleplate.fontsize) * this.pixelRatio;// 刻度值字体大小
    this.options.scaleplate.fontcolor = this.options.scaleplate.fontcolor === undefined ? '#f00' : this.options.scaleplate.fontcolor;// 刻度值字体颜色
    this.options.scaleplate.fontfamily = this.options.scaleplate.fontfamily === undefined ? 'Courier New' : this.options.scaleplate.fontfamily; // 刻度值字体样式

    this.options.centerLine = this.options.centerLine === undefined ? {} : this.options.centerLine;
    this.options.centerLine.width = (this.options.centerLine.width === undefined ? 2 : this.options.centerLine.width) * this.pixelRatio;
    this.options.centerLine.linecolor = this.options.centerLine.linecolor === undefined ? '#f00' : this.options.centerLine.linecolor;
    this.options.centerLine.height = this.options.centerLine.height === undefined ? '0.8' : this.options.centerLine.height;
    this.options.scaleplate.fullLineHeight = this.options.fullLineHeight === undefined ? '0.6' : this.options.fullLineHeight;
    this.options.scaleplate.halfLineHeight = this.options.fullLineHeight === undefined ? '0.4' : this.options.halfLineHeight;
    this.options.scaleplate.lineHeight = this.options.lineHeight === undefined ? '0.3' : this.options.lineHeight;

    this.options.unit = (this.options.unit === undefined ? 10 : this.options.unit) * this.pixelRatio; // 刻度间隔，默认值10
    this.options.value = this.options.value === undefined ? this.options.start : this.options.value; // 中心线位置，默认值为开始值
    this.options.background = this.options.background === undefined ? '#fff' : this.options.background; // 画布背景色，默认白色
    this.options.linecolor = this.options.linecolor === undefined ? '#000' : this.options.linecolor; // 中心线颜色，默认黑色
    this.options.capacity = this.options.capacity === undefined ? 1 : this.options.capacity; // 每个刻度代表的值
    this.moveDistance = -(this.options.value / this.options.capacity) * this.options.unit;// 滑动的距离
    this.options.rate = this.options.rate ? this.options.rate : 1;
    this.timer = null;
    this.init();
  }
  init() { 
    this.canvas = (typeof this.options.elem) === 'string' ? document.querySelector(this.options.elem) : this.options.elem;
    this.options.width = this.options.width ? (this.options.width * this.pixelRatio) : 200;
    this.options.height = this.options.height ? (this.options.height * this.pixelRatio) : 100;

    this.canvas.width = this.options.width;
    this.canvas.height = (this.options.height + (this.options.scaleplate.fontsize * 1.5)) ;
    
    this.addEvent();
    this.renderCanvas();
  }
  renderCanvas(setValue = false) {
    const ctx = this.canvas.getContext('2d');
    const {options = {} } = this;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    // 两个端点的对moveDistance的取值
    this.moveDistance = this.moveDistance >= 0 ? 0 : this.moveDistance;
    this.moveDistance = -this.moveDistance >= (options.end / options.capacity) * options.unit ? - (options.end / options.capacity) * options.unit : this.moveDistance;

    // 显示的值
    const bitArr = options.capacity.toString().split('.');
    const bitNum = bitArr[1] ? bitArr[1].length : 0; // 保证除法运算时的精度
    options.value = (Math.ceil(Math.abs(this.moveDistance) / options.unit) * ((10 ** bitNum) * options.capacity)) / (10 ** bitNum);

    let i = 0;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.lineWidth = options.scaleplate.width;
    for (i; ((i * options.unit) + (this.moveDistance + (options.width / 2)) < options.width) && (i * options.capacity <= options.end); i++) {
      // 画刻度线 x轴坐标
      const x = (i * options.unit) + (this.moveDistance + (options.width / 2));
      const textValue = options.capacity * i;

      ctx.beginPath();
      ctx.moveTo(x, Math.ceil((options.height * 3) / 4));
      ctx.fillStyle = options.scaleplate.fontcolor;

      if (i % 10 === 0) { // 第1或10格刻度
        ctx.moveTo(x, Math.ceil(options.height * (1 - options.scaleplate.fullLineHeight)));
        ctx.font = `${options.scaleplate.fontsize}px ${options.scaleplate.fontfamily}`; // 设置文本的字体大小和字体样式
        ctx.fillStyle = options.scaleplate.fontcolor;
        ctx.fillText(textValue, x - ((textValue.toString()).length * (this.options.scaleplate.fontsize * 0.3)), (this.options.scaleplate.fontsize * 1.5) + options.height);
      } else if (i % 5 === 0) { // 第5格刻度
        ctx.moveTo(x, Math.ceil(options.height * (1 - options.scaleplate.halfLineHeight)));
      } else { // 其他刻度
        ctx.moveTo(x, Math.ceil(options.height * (1 - options.scaleplate.lineHeight)));
      }
      ctx.lineTo(x, options.height);
      ctx.strokeStyle = options.scaleplate.color;
      ctx.stroke(); // 实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径
      ctx.closePath(); // 关闭当前的绘制路径
    }
    // 绘制中心线
    ctx.beginPath();
    ctx.fillStyle = this.canvas.background;
    ctx.fillRect = (0, 0, this.canvas.width, this.canvas.height);
    ctx.lineWidth = options.centerLine.width;
    ctx.moveTo(Math.floor(this.canvas.width / 2), (1 - options.centerLine.height) * options.height);
    ctx.lineTo(Math.floor(this.canvas.width / 2), this.options.height);
    ctx.strokeStyle = options.centerLine.linecolor;
    ctx.stroke();
    ctx.closePath();

    // 标尺底部线
    
    ctx.beginPath();
    ctx.moveTo(0, this.options.height - 1);
    ctx.lineTo(this.options.width, this.options.height - 1);
    ctx.strokeStyle =  options.scaleplate.color;
    ctx.lineWidth = options.scaleplate.width * 1;
    ctx.stroke();
    ctx.closePath();
    if (this.options.onChange && !setValue) {
      this.options.onChange(options.value);
    }
  }
  setValue(value) {
    if (typeof value !== 'number' && !parseInt(value, 10) && (parseInt(value, 10) !== 0)) { return false; }
    if (this.timer) { window.cancelAnimationFrame(this.timer); }
    const that = this;
    const targetX = -(value / this.options.capacity) * this.options.unit;
    let distance = targetX - this.moveDistance;
    function move() {
      that.moveDistance += distance / 10;
      distance -= distance / 10;
      if (Math.abs(distance) < 5) {
        that.moveDistance = targetX;
        that.renderCanvas(true);
      } else {
        that.renderCanvas(true);
        that.timer = window.requestAnimationFrame(move);
      }
    }
    move();
  }
  addEvent() {
    let startX;
    let x;
    let curX;
    let startTime;
    let endTime;
    // 添加手指触碰屏幕时的touchstart事件
    this.canvas.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      e.preventDefault();
      startTime = (new Date()).getTime();
      x = e.touches[0].clientX; // 获取第一个手指对象的X轴坐标值
      startX = x;
    }, false);
    // 添加手指滑动屏幕时的touchmove事件
    this.canvas.addEventListener('touchmove', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.timer) {
        window.cancelAnimationFrame(this.timer);
      }
      curX = e.touches[0].clientX;
      this.moveDistance += (curX - x) * this.options.rate;
      x = curX;
      this.renderCanvas();
    }, false);
    this.canvas.addEventListener('touchend', (e) => {
      e.stopPropagation();
      e.preventDefault();
      endTime = (new Date()).getTime();
      curX = e.changedTouches[0].clientX;
      const totalTime = endTime - startTime;
      const totalX = (curX - startX) * this.options.rate;
      const that = this;
      let curSpeed = parseInt((totalX / totalTime) * 1000, 10);
      function move() {
        const distanceUnit = Math.abs(that.moveDistance % that.options.unit) - (totalX >= 0 ? 0 : that.options.unit);
        if (Math.abs(curSpeed) <= 50) {
          that.moveDistance += distanceUnit;
          that.renderCanvas();
          return false;
        } else {
          that.moveDistance += curSpeed / 60; // 1/60 60帧刚好
          that.renderCanvas();
          curSpeed -= curSpeed / 10; // 每次衰减
        }
        that.timer = window.requestAnimationFrame(move);
      }
      move();
    }, false);
  }
}

export default Ruler;
