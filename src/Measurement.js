import leftPad from 'left-pad';

const defaultOptions = {
  n: 4,
  decimals: 4,
  default: 0,
  min: 400,
};

class Measurement {
  constructor(el, options) {
    this.el = el;

    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.value = this.roundValue(this.options.default);

    this.update(this.value, true);
  }

  displayValue(value) {
    const [int, dec] = `${value}`.split('.');

    if (this.options.decimals) {
      return `${leftPad(int, this.options.n, '0')}.${dec}`;
    }

    return leftPad(int, this.options.n, '0');
  }

  roundValue(value) {
    const { n } = this.options;

    const newValue = value * Math.pow(10, n);
    const nValue = `${Math.round(newValue)}`.length;

    return (newValue / Math.pow(10, nValue - n)).toFixed(this.options.decimals);
  }

  update(value, force) {
    const newValue = this.roundValue(value);

    if (force || Math.abs(this.value - newValue) >= this.options.min) {
      this.el.innerHTML = '';

      const active = document.createElement('div');
      active.className = 'active';
      active.innerText = this.displayValue(newValue);

      if (this.value) {
        const old = document.createElement('div');
        old.className = 'old';
        old.innerText = this.displayValue(this.value);
        this.el.appendChild(old);
      }

      this.el.appendChild(active);

      this.value = this.roundValue(newValue);
    }
  }
}

export default Measurement;
