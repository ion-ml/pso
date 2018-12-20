const Pso = require('../src/pso');

const { log } = console;

const cognitiveWeight = 0.3;
const fitnessFunction = (x) =>  (5 * Math.cos(2 * Math.PI * x)) - Math.pow(x, 2);
const inertialWeight = 0.6;
const numDimensions = 1;
const numIterations = 200;
const numParticles = 10;
const searchSpaceLowerBound = -5.12;
const searchSpaceUpperBound = 5.12;
const socialWeight = 0.7;
const useIntervalConfinement = true;

const pso = new Pso(
  cognitiveWeight,
  fitnessFunction,
  inertialWeight,
  numDimensions,
  numIterations,
  numParticles,
  searchSpaceLowerBound,
  searchSpaceUpperBound,
  socialWeight,
  useIntervalConfinement
);

pso.optimise();

log(`f(${pso.globalBest.positions}) = ${pso.globalBest.fitness}`);
