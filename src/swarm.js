const constants = require('./constants');
const particle = require('./particle');

const {
  COGNITIVE_WEIGHT_DEFAULT,
  NUM_DIMENSIONS_DEFAULT,
  NUM_PARTICLES_DEFAULT,
  SOCIAL_WEIGHT_DEFAULT
} = constants;

const { Particle } = particle;

class Swarm
{
  get particles() {
    return this._particles;
  }

  constructor(params) {
    this.init(params);
  }

  init(params) {
    const {
      cognitiveWeight = COGNITIVE_WEIGHT_DEFAULT,
      inertia,
      lowerBound,
      numDimensions = NUM_DIMENSIONS_DEFAULT,
      numParticles = NUM_PARTICLES_DEFAULT,
      socialWeight = SOCIAL_WEIGHT_DEFAULT,
      upperBound
    } = params;

    const particles = [];

    for (var i = 0; i < numParticles; i++) {
      particles.push(new Particle({
        cognitiveWeight,
        inertia,
        lowerBound,
        numDimensions,
        socialWeight,
        upperBound,
      }));
    }

    this._particles = particles;
  }

  findGlobalBestParticle() {
    return this.particles.reduce((globalBestParticle, particle) => {
      if (globalBestParticle === null) globalBestParticle = particle;

      if (particle.fitness > globalBestParticle.fitness) {
        globalBestParticle = particle;
      }

      return globalBestParticle;
    }, null);
  }

  update(globalBestParticle = null) {
    const globalBestParticleLocal = globalBestParticle || this.findGlobalBestParticle();

    this.particles.forEach(particle => particle.update(globalBestParticleLocal.positions));
  }
}

module.exports = {
  Swarm: Swarm,
};
