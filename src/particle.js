const constants = require('./constants');

const {
  COGNITIVE_WEIGHT_DEFAULT,
  NUM_DIMENSIONS_DEFAULT,
  SOCIAL_WEIGHT_DEFAULT,
  SQUARED_POWER,
} = constants;

class Particle
{
  get best() {
    return this._best;
  }

  get cognitiveWeight() {
    return this._cognitiveWeight;
  }

  get fitness() {
    return this._fitness;
  }

  get inertia() {
    return this._inertia;
  }

  get lastPositions() {
    return this._lastPositions;
  }

  get lastVelocities() {
    return this._lastVelocities;
  }

  get lowerBound() {
    return this._lowerBound;
  }

  get numDimensions() {
    return this._numDimensions;
  }

  get positions() {
    return this._positions;
  }

  get socialWeight() {
    return this._socialWeight;
  }

  get upperBound() {
    return this._upperBound;
  }

  get velocities() {
    return this._velocities;
  }

  constructor(params) {
    const {
      cognitiveWeight = COGNITIVE_WEIGHT_DEFAULT,
      inertia,
      lowerBound,
      numDimensions = NUM_DIMENSIONS_DEFAULT,
      socialWeight = SOCIAL_WEIGHT_DEFAULT,
      upperBound
    } = params;

    this._best = [];
    this._cognitiveWeight = cognitiveWeight;
    this._inertia = inertia;
    this._lastPositions = [];
    this._lastVelocities = [];
    this._lowerBound = lowerBound;
    this._numDimensions = numDimensions;
    this._positions = [];
    this._socialWeight = socialWeight;
    this._upperBound = upperBound;
    this._velocities = [];

    this.init();
    this._fitness = this.generateFitness();
  }

  init() {
    let positionPerDimension;
    let velocityPerDimension;

    for (var dimension = 0; dimension < this._numDimensions; dimension++) {
      positionPerDimension = this.generateBoundedRandomValue();
      velocityPerDimension = this.generateBoundedRandomValue();

      this._positions.push(positionPerDimension);
      this._best.push(positionPerDimension);
      this._velocities.push(velocityPerDimension);
    }
  }

  generateBoundedRandomValue(rand = Math.random) {
    return ((rand() * (this.upperBound - this.lowerBound)) + this.lowerBound);
  }

  generateCognitiveForces(rand = Math.random) {
    return this.positions.map((positionPerDimension, dimension) => {
      return this.cognitiveWeight * rand() * (this.best[dimension] - positionPerDimension);
    });
  }

  generateFitness(positions = null) {
    const positionsLocal = positions || this._positions;

    return positionsLocal.reduce((total, positionPerDimension) =>
      total += Math.pow(positionPerDimension, SQUARED_POWER), 0);
  }

  generateSocialForces(globalBest, rand = Math.random) {
    return this.positions.map((positionPerDimension, dimension) => {
      return this.cognitiveWeight * rand() * (globalBest[dimension] - positionPerDimension);
    });
  }

  generateInertialSpeeds() {
    return this.velocities.map(velocityPerDimension => this.inertia * velocityPerDimension);
  }

  update(globalBest) {
    this.updateVelocities(globalBest);
    this.updatePositions();
    this.updateBest();

    this._fitness = this.generateFitness();
  }

  updateBest(bestFitness = null, currentFitness = null) {
    const bestFitnessLocal = bestFitness || this.generateFitness(this.best);
    const currentFitnessLocal = currentFitness || this.generateFitness(this.positions);

    if (currentFitnessLocal > bestFitnessLocal) {
      this._best = this.positions;
    }
  }

  updatePosition(dimension, velocityPerDimension) {
    const currentPositionPerDimension = this._positions[dimension];
    const nextPositionPerDimension = currentPositionPerDimension + velocityPerDimension;

    this._lastPositions[dimension] = currentPositionPerDimension;
    this._positions[dimension] = nextPositionPerDimension;
  }

  updatePositions() {
    this.velocities.forEach((velocityPerDimension, dimension) =>
      this.updatePosition(dimension, velocityPerDimension));
  }

  updateVelocity(cognitiveForce, dimension, inertialSpeed, socialForce) {
    const currentVelocityPerDimension = this._velocities[dimension];
    const nextVelocityPerDimension = inertialSpeed + cognitiveForce + socialForce;

    this._lastVelocities = currentVelocityPerDimension;
    this._velocities[dimension] = nextVelocityPerDimension;
  }

  updateVelocities(
    globalBest,
    cognitiveForces = null,
    inertialSpeeds = null,
    socialForces = null
  ) {
    const cognitiveForcesLocal = cognitiveForces || this.generateCognitiveForces();
    const inertialSpeedsLocal = inertialSpeeds || this.generateInertialSpeeds();
    const socialForcesLocal = socialForces || this.generateSocialForces(globalBest);

    for (var dimension = 0; dimension < this.numDimensions; dimension++) {
      this.updateVelocity(
        cognitiveForcesLocal[dimension],
        dimension,
        inertialSpeedsLocal[dimension],
        socialForcesLocal[dimension]
      );
    }
  }
}

module.exports = {
  Particle: Particle,
};
