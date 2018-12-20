const Particle = require('./particle');

class Pso
{
  get fitnessFunction() {
    return this._fitnessFunction;
  }

  get globalBest() {
    return this._globalBest;
  }

  get globalBests() {
    return this._globalBests;
  }

  get numIterations() {
    return this._numIterations;
  }

  get numParticles() {
    return this._numParticles;
  }

  get particles() {
    return this._particles;
  }

  constructor(
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
  ) {
    this._fitnessFunction = fitnessFunction;
    this._numIterations = numIterations;
    this._numParticles = numParticles;
    this._globalBest = null;
    this._globalBests = [];
    this._particles = [];

    for (var i = 0; i < this.numParticles; i++) {
      this._particles.push(
        new Particle(
          cognitiveWeight,
          fitnessFunction,
          inertialWeight,
          numDimensions,
          searchSpaceLowerBound,
          searchSpaceUpperBound,
          socialWeight,
          useIntervalConfinement
        )
      );
    }
    this.particles.forEach(particle => particle.init());
  }

  findCurrentGlobalBest() {
    return this.particles.reduce((globalBest, particle) => {
      if (globalBest === null) {
        globalBest = particle;
      } else if (particle.fitness > globalBest.fitness) {
        globalBest = particle;
      }
      return globalBest;
    }, null);
  }

  optimise() {
    for (var i = 0; i < this.numIterations; i++) {
      this.updateGlobalBest();
      this.particles.forEach(particle => {
        particle.update(this.globalBest);
      });

      this.globalBests.push({
        fitness: this.globalBest.fitness,
        position: this.globalBest.positions,
      });
    }
  }

  updateGlobalBest() {
    const currentGlobalBest = this.findCurrentGlobalBest();
    const lastGlobalBest = this.globalBest;
    if (lastGlobalBest === null) {
      this._globalBest = currentGlobalBest;
    } else if (currentGlobalBest.fitness > lastGlobalBest.fitness) {
      this._globalBest = currentGlobalBest;
    }
  }
}

module.exports = Pso;
