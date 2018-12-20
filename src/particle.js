class Particle
{
  get bestFitness() {
    return this._bestFitness;
  }

  get bestPositions() {
    return this._bestPositions;
  }

  get cognitiveWeight() {
    return this._cognitiveWeight;
  }

  get fitness() {
    return this._fitness;
  }

  get fitnessFunction() {
    return this._fitnessFunction;
  }

  get inertialWeight() {
    return this._inertialWeight;
  }

  get numDimensions() {
    return this._numDimensions;
  }

  get positions() {
    return this._positions;
  }

  get searchSpaceLowerBound() {
    return this._searchSpaceLowerBound;
  }

  get searchSpaceUpperBound() {
    return this._searchSpaceUpperBound;
  }

  get socialWeight() {
    return this._socialWeight;
  }

  get useIntervalConfinement() {
    return this._useIntervalConfinement;
  }

  get velocities() {
    return this._velocities;
  }

  constructor(
    cognitiveWeight,
    fitnessFunction,
    inertialWeight,
    numDimensions,
    searchSpaceLowerBound,
    searchSpaceUpperBound,
    socialWeight,
    useIntervalConfinement
  ) {
    this._fitnessFunction = fitnessFunction;
    this._numDimensions = numDimensions;
    this._cognitiveWeight = cognitiveWeight;
    this._inertialWeight = inertialWeight;
    this._socialWeight = socialWeight;
    this._searchSpaceLowerBound = searchSpaceLowerBound;
    this._searchSpaceUpperBound = searchSpaceUpperBound;
    this._useIntervalConfinement = useIntervalConfinement;
    this._fitness = null;
    this._bestFitness = null;
    this._bestPositions = [];
    this._positions = [];
    this._velocities = [];
  }

  init() {
    let positionalComponent;
    let velocityComponent;
    for (var dimension = 0; dimension < this._numDimensions; dimension++) {
      positionalComponent = this.generateBoundedRandomValue();
      velocityComponent = this.generateBoundedRandomValue();
      this._positions.push(positionalComponent);
      this._bestPositions.push(positionalComponent);
      this._velocities.push(velocityComponent);
    }
    this.updateFitness();
    this.updateBestFitness();
  }

  generateBoundedRandomValue(rand = Math.random) {
    const lowerBound = this.searchSpaceLowerBound;
    const upperBound = this.searchSpaceUpperBound;
    return ((rand() * (upperBound - lowerBound)) + lowerBound);
  }

  generateCognitiveForce() {
    return this.generateForce(
      this.bestPositions,
      this.cognitiveWeight
    );
  }

  generateForce(bestPositions, weight, rand = Math.random) {
    return bestPositions.map((bp, i) => bp - this.positions[i])
                        .map(diff => diff * weight * rand());
  }

  generateForcesAndInertias(globalBestPositions) {
    return {
      cognitiveForces: this.generateCognitiveForce(),
      inertias: this.generateInertias(),
      socialForces: this.generateSocialForce(globalBestPositions),
    };
  }

  generateFitness() {
    const calculateFitness = this.fitnessFunction;
    return this.positions.reduce((fitnessAcrossDimensions, positionalComponent) => {
      fitnessAcrossDimensions += calculateFitness(positionalComponent);
      return fitnessAcrossDimensions;
    }, 0);
  }

  generateInertias() {
    return this.velocities.map(velocity => velocity * this.inertialWeight);
  }

  generateSocialForce(globalBestPositions) {
    return this.generateForce(
      globalBestPositions,
      this.socialWeight
    );
  }

  update(globalBest) {
    this.updateFitness();
    this.updateBestFitness();
    this.updateVelocities(globalBest);
    this.updatePositions();
  }

  updateBestFitness() {
    if (this.bestFitness === null) {
      this._bestFitness = this.fitness;
      this._bestPositions = this._positions;
    } else if (this.fitness > this.bestFitness) {
      this._bestFitness = this.fitness;
      this._bestPositions = this._positions;
    }
  }

  updateFitness() {
    this._fitness = this.generateFitness();
  }

  updatePositions() {
    this.velocities.forEach((velocityComponent, dimension) => {
      const currentPositionalComponent = this._positions[dimension];
      let nextPositionalComponent = currentPositionalComponent + velocityComponent;

      if (this.useIntervalConfinement) {
        this.updateUsingIntervalConfinement(
          nextPositionalComponent,
          velocityComponent,
          dimension
        );
      } else {
        this._positions[dimension] = nextPositionalComponent;
      }
    });
  }

  updateUsingIntervalConfinement(
    positionalComponent,
    velocityComponent,
    dimension
  ) {
    let positionalComponentLocal = positionalComponent;
    let velocityComponentLocal = velocityComponent;
    if (positionalComponentLocal > this.searchSpaceUpperBound) {
      positionalComponentLocal = this.searchSpaceUpperBound;
    }
    if (positionalComponentLocal < this.searchSpaceLowerBound) {
      positionalComponentLocal = this.searchSpaceLowerBound;
    }
    if (positionalComponentLocal !== positionalComponent) {
      velocityComponentLocal = velocityComponent * -1;
    }
    this._positions[dimension] = positionalComponentLocal;
    this._velocities[dimension] = velocityComponentLocal;
  }

  updateVelocities(globalBest) {
    const {
      cognitiveForces,
      inertias,
      socialForces
    } = this.generateForcesAndInertias(globalBest.positions);
    let cognitiveForce;
    let inertia;
    let socialForce;

    for (var dimension = 0; dimension < this.numDimensions; dimension++) {
      cognitiveForce = cognitiveForces[dimension];
      inertia = inertias[dimension];
      socialForce = socialForces[dimension];
      this._velocities[dimension] = inertia + cognitiveForce + socialForce;
    }
  }
}

module.exports = Particle;
