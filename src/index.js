const pso = require('./pso');
const { log } = console;

const results = pso({
  cognitiveWeight: 2,
  inertia: 0.3,
  lowerBound: 0,
  numDimensions: 2,
  numParticles: 10,
  numIterations: 100,
  socialWeight: 2,
  upperBound: 10,
});

log(results);
