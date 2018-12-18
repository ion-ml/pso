const constants = require('./constants');
const swarm = require('./swarm');

const {
  COGNITIVE_WEIGHT_DEFAULT,
  NUM_DIMENSIONS_DEFAULT,
  NUM_PARTICLES_DEFAULT,
  SOCIAL_WEIGHT_DEFAULT,
} = constants;

const { Swarm } = swarm;

const pso = ({
  cognitiveWeight = COGNITIVE_WEIGHT_DEFAULT,
  inertia,
  lowerBound,
  numDimensions = NUM_DIMENSIONS_DEFAULT,
  numParticles = NUM_PARTICLES_DEFAULT,
  numIterations,
  socialWeight = SOCIAL_WEIGHT_DEFAULT,
  upperBound,
}) => {
  const results = [];
  const swarm = new Swarm({
    cognitiveWeight,
    inertia,
    lowerBound,
    numDimensions,
    numParticles,
    numIterations,
    socialWeight,
    upperBound
  });

  for (var i = 0; i < numIterations; i++) {
    swarm.update();
    results.push(swarm.findGlobalBestParticle().fitness);
  }

  return results;
};

module.exports = pso;
