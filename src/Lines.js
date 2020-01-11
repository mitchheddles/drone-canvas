import mouse from './Mouse';
const defaultOptions = {
  maxWidth: 100,
  minWidth: 20,
  spacing: 50,
  speed: 1,
  stroke: 'rgba(255, 255, 255, 1)',
};

class Line {
  constructor(canvas, { minWidth, maxWidth, spacing, speed, y }) {
    this.canvas = canvas;

    const { width } = canvas.getDimensions();

    this.y = y;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.speed = speed;
    this.spacing = spacing;
    this.size = this.getSize(y);
    this.x = (width - this.size) / 2;
  }

  getSize = (y) => {
    const { maxWidth, minWidth } = this;
    const { height } = this.canvas.getDimensions();
    return minWidth + (maxWidth - minWidth) * (1 - Math.abs(y - (height / 2)) / (height / 2));
  }

  update = () => {
    const { height, width } = this.canvas.getDimensions();
    const dy = (mouse.y - (height / 2)) / (height / 2);
    // Move
    this.y = this.y + this.speed * dy;

    if (this.y > height + this.spacing) {
      this.y = - this.spacing;
    } else if (this.y < -this.spacing) {
      this.y = height + this.spacing;
    }

    this.size = this.getSize(this.y);
    this.x = (width - this.size) / 2;
  }
}

class Lines {
  constructor(canvas, options = {}) {
    this.canvas = canvas;

    this.lines = [];
    this.options = {
      ...defaultOptions,
      ...options,
    };

    // Get nodes
    this.start();
  }

  start = () => {
    this.generateLines();
  }

  handleResize = () => {
    // console.log('resize lines');
  }

  generateLines() {
    const { maxWidth, minWidth, spacing, speed } = this.options;

    const { height } = this.canvas.getDimensions();

    const n = (height / spacing) + 2; // Add two extra lines
    const startY = - spacing;

    for (let i = 0; i < n; i++) {
      const y = startY + i * spacing;

      this.lines.push(new Line(this.canvas, {
        maxWidth,
        minWidth,
        speed,
        spacing,
        y,
      }));
    }
  }

  update(t) {
    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i].update(t);
    }
  }

  render(ctx) {
    for (let i = 0; i < this.lines.length; i++) {
      const {
        size,
        x,
        y,
      } = this.lines[i];

      // Render node
      ctx.strokeStyle = this.options.stroke;

      ctx.beginPath();
      ctx.moveTo(Math.floor(x) + 0.5, Math.floor(y) + 0.5);
      ctx.lineTo(Math.floor(x + size) + 0.5, Math.floor(y) + 0.5);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

export default Lines;
