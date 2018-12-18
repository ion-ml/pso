const expect = require('chai').expect;

const constants = require('../src/constants');
const swarm = require('../src/swarm');

const { NUM_PARTICLES_DEFAULT } = constants;
const { Swarm } = swarm;

describe('Swarm', () => {
  describe('constructor', () => {
    it(`should construct a 'numParticles' number of Particles`, () => {
      const inertia = 0.5;
      const lowerBound = 0;
      const numParticles = 10;
      const upperBound = 20;

      const swarm = new Swarm({
        inertia,
        lowerBound,
        numParticles,
        upperBound
      });

      expect(swarm.particles).to.have.lengthOf(numParticles);
    });
    it(`should construct the 'NUM_PARTICLES_DEFAULT' number of Particles`, () => {
      const inertia = 0.5;
      const lowerBound = 0;
      const upperBound = 20;

      const swarm = new Swarm({
        inertia,
        lowerBound,
        upperBound
      })

      expect(swarm.particles).to.have.lengthOf(NUM_PARTICLES_DEFAULT);
    });
  });

  describe('findGlobalBestParticle', () => {
    it('should return the best mock particle by fitness', () => {
      // Arrange
      const inertia = 0.5;
      const lowerBound = 0;
      const numParticles = 4;
      const upperBound = 20;

      const swarm = new Swarm({
        inertia,
        lowerBound,
        numParticles,
        upperBound
      });

      const particleA = swarm.particles[0];
      const particleB = swarm.particles[1];
      const particleC = swarm.particles[2];
      const particleD = swarm.particles[3];

      particleA._fitness = 1;
      particleB._fitness = 3;
      particleC._fitness = 0.5;
      particleD._fitness = 2;

      swarm._particles = [ particleA, particleB, particleC, particleD ];

      // Act
      expect(swarm.findGlobalBestParticle()).to.deep.equal(particleB);
    });
    it('should return the best particle by fitness', () => {
      // Arrange
      const inertia = 0.5;
      const lowerBound = 0;
      const numParticles = 4;
      const upperBound = 20;

      const swarm = new Swarm({
        inertia,
        lowerBound,
        numParticles,
        upperBound
      });

      const bestParticle = swarm.particles.reduce((globalBestParticle, particle) => {
        if (globalBestParticle === null) globalBestParticle = particle;

        if (particle.fitness > globalBestParticle.fitness) {
          globalBestParticle = particle;
        }

        return globalBestParticle;
      }, null);

      // Act
      expect(swarm.findGlobalBestParticle()).to.deep.equal(bestParticle);
    });
  });

  describe('update', () => {
    it('should update all of the particle', () => {
      // Arrange
      const inertia = 0.5;
      const lowerBound = 0;
      const numDimensions = 2;
      const numParticles = 4;
      const upperBound = 20;

      const swarm = new Swarm({
        inertia,
        lowerBound,
        numDimensions,
        numParticles,
        upperBound
      });

      // Act
      swarm.update();

      // Assert
      swarm.particles.forEach(particle => {
        expect(particle.positions).to.not.deep.equal(particle.lastPositions);
        expect(particle.velocities).to.not.deep.equal(particle.lastVelocities);        
      });
    });
  });
});
