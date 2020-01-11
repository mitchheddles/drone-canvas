import throttle from 'lodash.throttle';
import mouse from './Mouse';

export const degToRad = deg => deg * Math.PI / 180;

export const radToDeg = rad => rad * 180 / Math.PI;

export const mod = (a, n) => a - Math.floor(a / n) * n;

export const getRandom = ({ min = 0, max = 1 }) => Math.random() * (max - min) + min;

// Use a class to handle resizing, avoids multiple window event listeners
class DocumentHelper {
  width = document.body.clientWidth;
  height = document.body.clientHeight;
  listeners = {};

  constructor() {
    this.handleResize = throttle(this.onResize, 20);

    window.addEventListener('resize', this.handleResize);
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

  onResize = () => {
    this.width = document.body.clientWidth;
    this.height = document.body.clientHeight;

    this.trigger('resize');
  }

  getDimensions = () => ({ width: this.width, height: this.height })

  getAspectRatio = () => this.height / this.width
}

export const documentHelper = new DocumentHelper();

// Returns the nodes position based on mouse position
export const getNodesMousePosition = (ring) => {
  const dx = ring.x0 - mouse.x;
  const dy = ring.y0 - mouse.y;
  const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  let pull = ring.options.distanceRate * mouse.mass / (Math.max(distance, mouse.mass) * ring.options.mass);

  let x = ring.x0 - pull * dx;
  let y = ring.y0 - pull * dy;

  if (Math.abs(x - ring.x0) > ring.options.distanceLimit) {
    x = ring.x0 + (ring.options.distanceLimit * (dx > 0 ? -1 : 1));
  }

  if (Math.abs(y - ring.y0) > ring.options.distanceLimit) {
    y = ring.y0 + (ring.options.distanceLimit * (dy > 0 ? -1 : 1));
  }

  return {
    x,
    y,
  };
};
