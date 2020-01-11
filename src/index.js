import Canvas from './Canvas';
import Lines from './Lines';
import Ring from './Ring';
import Measurement from './Measurement';

import mouse from './Mouse';

import { documentHelper } from './helpers';

const cursor = document.getElementById('cursor');
const background = document.getElementById('background');

const measurementX = new Measurement(document.getElementById('measurementX'));
const measurementY = new Measurement(document.getElementById('measurementY'));
const measurementWind = new Measurement(document.getElementById('measurementWind'), {
  n: 2,
  decimals: 1,
  default: 13,
  min: 1,
});
const measurementSpeed = new Measurement(document.getElementById('measurementSpeed'), {
  n: 2,
  decimals: 1,
  min: 10,
});

const canvas = new Canvas(document.getElementById('canvas'));

const copy = [...document.querySelectorAll('.copy p')];

copy.forEach((paragraph) => {
  const text = paragraph.innerText.split('');
  paragraph.innerHTML = text.map((letter, i) => `<span style="animation-delay: ${i * 0.02}s">${letter}</span>`).join('');
});

canvas.add(new Ring(canvas, {
  diameter: 200,
  n: 1,
  mass: 2,
  spacing: 0,
  rotationRate: 0,
  rotationLimit: 0,
  distanceRate: 2.5,
  distanceLimit: 100,
  stroke: 'rgba(255, 255, 255, .9)',
}));

canvas.add(new Ring(canvas, {
  diameter: 200,
  n: 1,
  mass: 2,
  spacing: 200,
  lineWidth: 4,
  shadow: {
    // blur: 10,
    // offsetX: 0,
    // offsetY: 0,
    // color: 'rgba(255, 255, 255, .8)',
  },
  rotationRate: .4,
  rotationLimit: 0.015,
  distanceRate: 2.5,
  distanceLimit: 100,
  stroke: 'rgba(255, 255, 255, .9)',
  follow: true,
}));

canvas.add(new Ring(canvas, {
  diameter: 400,
  n: 50,
  mass: 1,
  spacing: 7,
  lineWidth: 20,
  rotationRate: .3,
  rotationLimit: .015,
  distanceRate: 1,
  distanceLimit: 50,
  stroke: 'rgba(255, 255, 255, .85)',
}));

canvas.add(new Ring(canvas, {
  diameter: 500,
  n: 12,
  mass: 1,
  spacing: 10,
  rotationRate: .1,
  rotationLimit: .02,
  distanceRate: 1,
  distanceLimit: 40,
  stroke: 'rgba(255, 255, 255, .45)',
}));

canvas.add(new Ring(canvas, {
  diameter: 600,
  n: 5,
  spacing: 10,
  rotationRate: .1,
  rotationLimit: .005,
  distanceRate: 1,
  distanceLimit: 20,
  stroke: 'rgba(255, 255, 255, .25)',
}));

canvas.add(new Lines(canvas, {
  maxWidth: 140,
  minWidth: 0,
  spacing: 70,
  speed: 3,
}));

canvas.start();

const positionBackground = () => {
  const { width, height } = documentHelper.getDimensions();
  // Max background shift is 15%
  const x = width * -0.15 * mouse.x / width;
  const y = height * -0.15 * mouse.y / height;

  const scale = 1 + .1 * Math.abs(1 - mouse.y / height);

  background.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
};

const positionCursor = () => {
  const { width, height } = documentHelper.getDimensions();
  const x = .15 * (mouse.x - width / 2);
  const y = .05 * (mouse.y - height / 2);

  const rotate = .25 * x;

  cursor.style.transform = `translate(${x}px, ${y}px) rotateZ(${rotate}deg)`;
};

const updateMeasurements = () => {
  const { width, height } = documentHelper.getDimensions();
  measurementY.update(mouse.y / height);
  measurementX.update(mouse.x / width);
  // measurementWind.update(getRandom({ min: 13, max: 14 }));
  measurementSpeed.update(Math.sqrt(Math.pow(mouse.x - width / 2, 2) + Math.pow(mouse.y - height / 2, 2)));
};

mouse.on('move', () => {
  positionBackground();
  positionCursor();
  updateMeasurements();
});
