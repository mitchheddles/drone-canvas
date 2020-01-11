import { documentHelper } from './helpers';

class Canvas {
  objects = [];

  constructor(canvas) {
    if (!canvas || canvas.tagName !== 'CANVAS') {
      console.log('Canvas no found');
    }

    this.canvas = canvas;
    this.setCanvasDimensions();

    this.ctx = this.canvas.getContext('2d');

    documentHelper.on('resize', this.handleResize);
  }

  add = (object) => {
    this.objects.push(object);
  }

  start = () => {
    if (!this.startTime) {
      this.startTime = Date.now();
    }

    const dt = Date.now() - this.startTime;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.start);
  }

  handleResize = () => {
    this.setCanvasDimensions();

    this.objects.forEach(object => object.handleResize ? object.handleResize() : null);
  }

  setCanvasDimensions() {
    const { width, height } = documentHelper.getDimensions();

    this.canvas.height = height;
    this.canvas.width = width;

    // Save to avoid reflow
    this.dimensions = {
      height,
      width,
    };
  }

  getDimensions() {
    return this.dimensions;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  update(dt) {
    this.objects.forEach(object => object.update(dt));
  }

  render() {
    this.clearCanvas();

    this.objects.forEach(object => object.render(this.ctx));
  }
}

export default Canvas;
