const Pso = require('../src/pso');

const { log } = console;

const cognitiveWeight = 0.2;
const fitnessFunction = (x) => Math.pow(x, 2);
const inertialWeight = 0.6;
const numDimensions = 30;
const numIterations = 400000;
const numParticles = 30;
const searchSpaceLowerBound = -20;
const searchSpaceUpperBound = 20;
const socialWeight = 0.9;
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
