import mouse from './Mouse';
import { degToRad, mod, getNodesMousePosition } from './helpers';

const defaultOptions = {
  diameter: 300, // Pixels
  distanceLimit: 400, // Pixels
  distanceRate: 1,
  n: 5, // Number of arcs
  spacing: 50, // degrees
  stroke: 'rgba(255, 255, 255, 1)',
  lineWidth: 1,
  mass: 1,
  shadow: {},
  rotationLimit: 0.02,
  rotationRate: 1,
  follow: false,
};

class Ring {
  rotation = 0;

  constructor(canvas, options = {}) {
    this.canvas = canvas;

    this.arcs = [];
    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.setOrigin();

    // Get nodes
    this.generateArcs();
  }

  setOrigin = () => {
    const { width, height } = this.canvas.getDimensions();
    this.x0 =  width / 2;
    this.y0 =  height / 2;
    this.x = this.x0;
    this.y = this.y0;
  }

  handleResize = () => {
    this.setOrigin();
  }

  newArc({ angle, diameter, length, index }) {
    return {
      ...this.options,
      index,
      x: this.x,
      y: this.y,
      size: diameter / 2,
      sAngle: degToRad(angle),
      eAngle: degToRad(angle + length),
      update(t, parameters) {
        const {
          follow,
          rotation,
          rotationDirection,
          x,
          y,
        } = parameters;

        // Rotate
        if (follow) {
          this.sAngle = rotation - degToRad(this.size / 2);
          this.eAngle = this.sAngle + degToRad(this.size);
        } else {
          this.sAngle = this.sAngle + rotation * rotationDirection;
          this.eAngle = this.eAngle + rotation * rotationDirection;
        }

        // Move
        this.x = x;
        this.y = y;
      },
    };
  }

  generateArcs() {
    const {
      diameter,
      n,
      spacing,
    } = this.options;

    const startAngle = this.rotation;

    for (let i = 0; i < n; i++) {
      const length = (360 - (n * spacing)) / n; // degrees
      const angle = startAngle + i * (spacing + length);

      this.arcs.push(this.newArc({
        angle,
        diameter,
        length,
      }));
    }
  }

  update(t) {
    const { width } = this.canvas.getDimensions();
    let rotation;
    const rotationDirection = mouse.x > width / 2 ? 1 : -1;

    if (this.options.follow) {
      const targetRotation = mod(mouse.getAngle(), 2 * Math.PI);

      let dr = mod(this.rotation - targetRotation, 2 * Math.PI);
      if (dr > Math.PI) {
        dr = dr - 2 * Math.PI;
      }

      rotation = this.rotation - (dr) / 10;

      // Save rotation
      this.rotation = rotation;
    } else {
      rotation = this.options.rotationRate * Math.abs(mouse.x - width / 2) / 1000;

      if (rotation > this.options.rotationLimit) {
        rotation = this.options.rotationLimit;
      }
    }

    if (isNaN(rotation)) {
      rotation = 0;
    }

    const targetPosition = getNodesMousePosition(this);
    const dx = targetPosition.x - this.x;
    const dy = targetPosition.y - this.y;
    const dt = Math.sqrt((dx * dx + dy * dy)) / (1000);

    this.x = this.x + dx * dt;
    this.y = this.y + dy * dt;

    for (let i = 0; i < this.arcs.length; i++) {
      this.arcs[i].update(t, {
        rotation,
        rotationDirection,
        follow: this.options.follow,
        x: this.x,
        y: this.y,
      });
    }
  }

  render(ctx) {
    for (let i = 0; i < this.arcs.length; i++) {
      const {
        sAngle,
        eAngle,
        size,
        x,
        y,
      } = this.arcs[i];

      // Render node
      ctx.strokeStyle = this.options.stroke;
      ctx.beginPath();
      ctx.arc(x, y, size, sAngle, eAngle);
      ctx.lineWidth = this.options.lineWidth;
      ctx.shadowOffsetX = this.options.shadow.offsetX || 0;
      ctx.shadowOffsetY = this.options.shadow.offsetY || 0;
      ctx.shadowBlur = this.options.shadow.blur || 0;
      ctx.shadowColor = this.options.shadow.color || 0;
      ctx.stroke();
      ctx.closePath();
    }
  }
}

export default Ring;
