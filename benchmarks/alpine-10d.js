const Pso = require('../src/pso');

const { log } = console;

const cognitiveWeight = 0.3;
const fitnessFunction = (x) =>  x * Math.sin(x) + 0.1 * x;
const inertialWeight = 0.95;
const numDimensions = 10;
const numIterations = 40000;
const numParticles = 25;
const numTrials = 100;
const searchSpaceLowerBound = -10;
const searchSpaceUpperBound = 10;
const socialWeight = 0.55;
const useIntervalConfinement = true;

const fitnesses = [];
let pso;

for (var i = 0; i < numTrials; i++) {
  pso = new Pso(
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
  fitnesses.push(pso.globalBest.fitness);
}

const averageFitness = (fitnesses.reduce((total, fitness) => total += fitness, 0)) / fitnesses.length;

log('Average fitness', averageFitness);
