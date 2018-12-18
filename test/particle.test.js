const expect = require('chai').expect;

const constants = require('../src/constants');
const particle = require('../src/particle');

const { NUM_DIMENSIONS_DEFAULT } = constants;
const { Particle } = particle;

describe('Particle', () => {
  let cognitiveWeight = 2;
  let inertia = 0.6;
  let lowerBound = 1;
  let numDimensions = 2;
  let socialWeight = 2;
  let upperBound = 10;

  describe('constructor', () => {
    it(`should set a 'fitness' value based upon the generated 'positions'`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions,
      });
      const positions = particle.positions;

      // Act
      const expectedFitness = positions.reduce((total, position) =>
        total += Math.pow(position, numDimensions), 0);

      // Assert
      expect(particle.fitness).to.equal(expectedFitness);
    });
    it('should instantiate the class properties', () => {
      // Arrange
      const particle = new Particle({
        cognitiveWeight,
        lowerBound,
        upperBound,
        inertia,
        numDimensions,
        socialWeight,
      });

      // Assert
      expect(particle.cognitiveWeight).to.equal(cognitiveWeight);
      expect(particle.inertia).to.equal(inertia);
      expect(particle.lowerBound).to.equal(lowerBound);
      expect(particle.numDimensions).to.equal(numDimensions);
      expect(particle.socialWeight).to.equal(socialWeight);
      expect(particle.upperBound).to.equal(upperBound);

      expect(particle.lastPositions).to.have.lengthOf(0);
      expect(particle.lastVelocities).to.have.lengthOf(0);

    });
    it(`should use 'NUM_DIMENSIONS_DEFAULT', ${NUM_DIMENSIONS_DEFAULT}, when 'numDimensions' has not been received`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia
      });

      // Assert
      expect(particle.numDimensions).to.equal(NUM_DIMENSIONS_DEFAULT);
    });
    it(`should use 'COGNITIVE_WEIGHT_DEFAULT', ${COGNITIVE_WEIGHT_DEFAULT}, when 'cognitiveWeight' has not been received`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia
      });

      // Assert
      expect(particle.cognitiveWeight).to.equal(COGNITIVE_WEIGHT_DEFAULT);
    });
    it(`should use 'SOCIAL_WEIGHT_DEFAULT', ${SOCIAL_WEIGHT_DEFAULT}, when 'socialWeight' has not been received`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia
      });

      // Assert
      expect(particle.socialWeight).to.equal(SOCIAL_WEIGHT_DEFAULT);
    });
  });
  describe('generateBoundedRandomValue', () => {
    describe(`should return a value between a 'lowerBound' of '0' and an 'upperBound' of '10'`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions,
      });
      const numIterations = 100;

      for (var i = 0; i < numIterations; i++) {
        it(`Iteration num ${i}`, () => {
          // Act and Assert
          expect(particle.generateBoundedRandomValue()).to.be.within(lowerBound, upperBound);
        });
      }
    });

    it(`should return evenly distributed random values with a margin of error of 10%`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound: 0,
        upperBound,
        inertia,
        numDimensions,
      });
      const numIterations = 1000;

      let numOverFive = 0;
      let numUnderFive = 0;
      let result;

      // Act
      for (var i = 0; i < numIterations; i++) {
        result = particle.generateBoundedRandomValue();
        if (result < 5) {
          numUnderFive++;
        } else {
          numOverFive++;
        }
      }

      // Assert
      if (numOverFive > 500) {
        expect(numOverFive).to.be.within(500, 550);
        expect(numUnderFive).to.be.within(450, 500);
      } else {
        expect(numOverFive).to.be.within(450, 500);
        expect(numUnderFive).to.be.within(500, 550);
      }
    });
  });
  describe('generateFitness', () => {
    describe('should calculate the sum of the squares of all of the positions', () => {
      it(`when 'positions' is '[1, 1]'`, () => {
        // Arrange
        const particle = new Particle({
          lowerBound,
          upperBound,
          inertia,
          numDimensions: 2,
        });
        particle._positions = [1, 1];

        // Act
        particle.generateFitness();

        // Assert
        expect(particle.generateFitness()).to.equal(2);
      });
      it(`when 'positions' is '[3, 4]'`, () => {
        // Arrange
        const particle = new Particle({
          lowerBound,
          upperBound,
          inertia,
          numDimensions: 2,
        });
        particle._positions = [3, 4];

        // Act and Assert
        expect(particle.generateFitness()).to.equal(25);
      });
      it(`when 'positions' is '[-3, 4]'`, () => {
        // Arrange
        const particle = new Particle({
          lowerBound,
          upperBound,
          inertia,
          numDimensions: 2,
        });
        particle._positions = [-3, 4];

        // Act and Assert
        expect(particle.generateFitness()).to.equal(25);
      });
    });
  });

  describe('generateCognitiveForces', () => {
    it('should return an array containing the next set of cognitive forces', () => {
      // Arrange
      const particle = new Particle({
        cognitiveWeight: 3,
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 2,
      });

      // Act
      particle._positions = [1, 4];
      particle._best = [2, 1];

      const rand = () => 0.5;
      const expectedForceFirst = particle.cognitiveWeight * rand() * (2 - 1);
      const expectedForceSecond = particle.cognitiveWeight * rand() * (1 - 4);
      const expectedForce = [ expectedForceFirst, expectedForceSecond ];

      // Assert
      expect(particle.generateCognitiveForces(rand)).to.deep.equal(expectedForce);
    });
  });

  describe('generateInertialSpeeds', () => {
    describe('should return an array containing the existing velocities multiplied by the inertial value', () => {
      it(`when '_velocities' equals '[2, 4]' and 'inertia' is '0.5'`, () => {
        // Arrange
        const particle = new Particle({
          lowerBound,
          upperBound,
          inertia: 0.5,
          numDimensions: 2,
        });

        // Act
        particle._velocities = [2, 4];

        // Assert
        expect(particle.generateInertialSpeeds()).to.deep.equal([1, 2]);
      });
      it(`when '_velocities' equals '[0, 4, 8]' and 'inertia' is '0.1'`, () => {

        // Arrange
        const particle = new Particle({
          lowerBound,
          upperBound,
          inertia: 0.1,
          numDimensions: 3,
        });

        // Act
        particle._velocities = [0, 4, 8];

        // Assert
        expect(particle.generateInertialSpeeds()).to.deep.equal([0, 0.4, 0.8]);
      });
      it(`when 'numDimensions' is '5' and 'inertia' is '0'`, () => {

        // Arrange
        const particle = new Particle({
          lowerBound,
          upperBound,
          inertia: 0,
          numDimensions: 5,
        });

        // Assert
        expect(particle.generateInertialSpeeds()).to.deep.equal([0, 0, 0, 0, 0]);
      });
    });
  });

  describe('generateSocialForces', () => {
    it('should return an array containing the next set of social forces', () => {
      // Arrange
      const particle = new Particle({
        cognitiveWeight: 3,
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 2,
      });

      // Act
      particle._positions = [1, 4];
      const globalBest = [2, 1];

      const rand = () => 0.5;
      const expectedForceFirst = particle.cognitiveWeight * rand() * (2 - 1);
      const expectedForceSecond = particle.cognitiveWeight * rand() * (1 - 4);
      const expectedForce = [ expectedForceFirst, expectedForceSecond ];

      // Assert
      expect(particle.generateSocialForces(globalBest, rand)).to.deep.equal(expectedForce);
    });
  });

  describe('init', () => {
    it(`should set the 'best', 'positions' and 'velocities' vectors with the required 'numDimensions' of values.`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 10,
      });

      // Assert
      expect(particle.best).to.have.lengthOf(particle.numDimensions);
      expect(particle.positions).to.have.lengthOf(particle.numDimensions);
      expect(particle.velocities).to.have.lengthOf(particle.numDimensions);
    });
    it(`should set the 'best' vector with the expected random values.`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 10,
      });

      // Assert
      particle.best.forEach(best => {
        expect(best).to.be.within(lowerBound, upperBound);
      });
    });
    it(`should set the 'best' values to be the same as those within 'positions'`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 10,
      });

      // Assert
      particle.best.forEach((best, index) => {
        expect(best).to.equal(particle.positions[index]);
      });
    });
    it(`should set the 'positions' vector with the expected random values.`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 10,
      });

      // Assert
      particle.positions.forEach(position => {
        expect(position).to.be.within(lowerBound, upperBound);
      });
    });
    it(`should set the 'velocities' vector with the expected random values.`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 10,
      });

      // Assert
      particle.velocities.forEach(velocity => {
        expect(velocity).to.be.within(lowerBound, upperBound);
      });
    });
  });

  describe('updateBest', () => {
    it(`should copy 'positions' to 'best' when 'currentFitness' is greater than 'bestFitness'`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 10,
      });

      const fitnessBest = 2;
      const fitnessCurrent = 10;
      const positionsBest = [2, 2];
      const positionsCurrent = [5, 3];

      particle._best = positionsBest;
      particle._positions = positionsCurrent;

      // Act
      particle.updateBest(fitnessBest, fitnessCurrent);

      // Assert
      expect(particle.best).to.deep.equal(positionsCurrent);
      expect(particle.best).to.not.deep.equal(positionsBest);
    });
    it(`should NOT copy 'positions' to 'best' when 'currentFitness' is greater than 'bestFitness'`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 10,
      });

      const fitnessBest = 10;
      const fitnessCurrent = 5;
      const positionsBest = [2, 2];
      const positionsCurrent = [5, 3];

      particle._best = positionsBest;
      particle._positions = positionsCurrent;

      // Act
      particle.updateBest(fitnessBest, fitnessCurrent);

      // Assert
      expect(particle.best).to.deep.equal(positionsBest);
      expect(particle.best).to.not.deep.equal(positionsCurrent);
    });
  });

  describe('updatePosition', () => {
    it(`should update the 'positon' elment defined by the received 'dimension'`, () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 10,
      });

      const dimension = 2;
      const velocityPerDimension = 5;
      const currentPositionPerDimension = particle.positions[dimension];
      const nextPositionPerDimension = currentPositionPerDimension + velocityPerDimension;

      // Act
      particle.updatePosition(dimension, velocityPerDimension);

      // Assert
      expect(particle.positions[dimension]).to.equal(nextPositionPerDimension);
    });
  });

  describe('updatePositions', () => {
    it('should update all positions', () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions: 2,
      });

      particle._positions = [10, 1];
      particle._velocities = [2, 3];

      // Act
      particle.updatePositions();

      // Assert
      expect(particle.positions[0]).to.equal(12);
      expect(particle.positions[1]).to.equal(4);
    });
  });

  describe('updateVelocity', () => {
    it('should update the expected velocity dimension', () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions,
      });
      const cognitiveForce = 2;
      const dimension = 1;
      const inertialSpeed = 4;
      const socialForce = 3;

      // Act
      particle.updateVelocity(cognitiveForce, dimension, inertialSpeed, socialForce);

      // Assert
      expect(particle.velocities[dimension]).to.equal(inertialSpeed + cognitiveForce + socialForce);
    });
  });

  describe('updateVelocities', () => {
    it('should update all of the velocities', () => {
      // Arrange
      const particle = new Particle({
        lowerBound,
        upperBound,
        inertia,
        numDimensions,
      });
      const cognitiveForces = [1, 2];
      const globalBest = [1, 1];
      const inertialSpeeds = [3, 7];
      const socialForces = [10, 0.5];

      // Act
      particle.updateVelocities(
        globalBest,
        cognitiveForces,
        inertialSpeeds,
        socialForces,
      );

      // Arrange
      particle.velocities.forEach((velocity, dimension) => {
        const cognitiveForce = cognitiveForces[dimension];
        const inertialSpeed = inertialSpeeds[dimension];
        const socialForce = socialForces[dimension];

        expect(velocity).to.equal(inertialSpeed + cognitiveForce + socialForce);
      });
    });
  });
});
