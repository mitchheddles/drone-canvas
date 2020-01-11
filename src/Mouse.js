import throttle from 'lodash.throttle';
import { documentHelper } from './helpers';

const defaultOptions = {
  holdingAngle: 60,
  xLimit: 90,
  yLimit: 90,
};

class Mouse {
  x = 0;
  y = 0;
  z = 0;
  dx = 0;
  dy = 0;
  mass = 100;
  listeners = {};

  constructor(options = {}) {
    this.parent = document.body;
    this.options = { ...defaultOptions, options };
    this.originalMass = this.mass;

    this.throttledDeviceMove = throttle(this.handleDeviceMove, 20);
    this.throttledMove = throttle(this.handleMove, 20);

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.throttledDeviceMove, false);
    }

    this.parent.addEventListener('mousemove', this.throttledMove);
    this.parent.addEventListener('mousedown', this.handleClick);
  }

  on = (event, callback, args = {}) => {
    if (typeof this.listeners[event] === 'undefined') {
      this.listeners[event] = [];
    }

    this.listeners[event].push({ callback, args });
  }

  trigger = (event) => {
    if (typeof this.listeners[event] === 'undefined') {
      return;
    }

    this.listeners[event].forEach(({ callback, args }) => {
      if (typeof callback !== 'function') {
        console.error('The event was not a function');
        return;
      }

      callback(args);
    });
  }

  remove() {
    this.parent.removeEventListener('mousemove', this.handleMove);
    this.parent.removeEventListener('mousedown', this.handleClick);
    window.removeEventListener('deviceorientation', this.handleDeviceMove);
  }

  setPosition = (x, y) => {
    this.dx = this.x - x;
    this.dy = this.y - y;
    this.x = x;
    this.y = y;
  }

  getPosition = () => ({ x: this.x, y: this.y });

  getAngle = () => {
    const { height, width } = documentHelper.getDimensions();
    const dx = this.x - (width / 2);
    const dy = this.y - (height / 2);

    // Return radians
    const theta = Math.atan2(dy, dx);

    return theta >= 0 ? theta : theta + 2 * Math.PI;
  }

  restore = () => {
    this.mass = this.originalMass;
  }

  handleDeviceMove = (e) => {
    // beta - x, gamma - y, alpha - z (rotation axis)
    const { beta, gamma } = e;
    const { height, width } = documentHelper.getDimensions();

    let x = gamma;
    let y = beta;

    x += this.options.holdingAngle;

    x = width * (x / this.options.xLimit);
    y = height * (y / this.options.yLimit);

    this.setPosition(x, y);

    this.trigger('move');
  }

  handleMove = (e) => {
    this.setPosition(e.pageX, e.pageY);

    this.trigger('move');
  }

  handleClick = (e) => {
    this.trigger('click');
  }
}

export default new Mouse();
