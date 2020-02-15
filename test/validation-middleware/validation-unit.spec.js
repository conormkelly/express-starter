const colors = require('colors');

//* Test libraries
const chai = require('chai');
// Extends chai expect/should to work with sinon spies etc
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

//* Test methods
const { expect } = chai;
const sinon = require('sinon');

// Mock generators
const { mockRequest, mockResponse } = require('mock-req-res');

// Test data
const { VALID_ID, INVALID_ID } = require('../product/test-data');

// Methods under test
const { validateId } = require('../../middleware/validation');

describe('Validation Middleware - Unit tests', () => {
  describe('validateId', () => {
    it('should just call next with valid id', async () => {
      // Arrange
      const req = mockRequest({ params: { id: VALID_ID } });
      const res = mockResponse();
      const next = sinon.stub();

      // Act
      await validateId('product')(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      expect(JSON.stringify(next.args)).to.equal(JSON.stringify([[]]));
    });

    it('should generate error with missing id', async () => {
      // Arrange
      const req = mockRequest({ params: {} });
      const res = mockResponse();
      const next = sinon.stub();

      // Act
      await validateId('product')(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.statusCode).to.equal(400);
      expect(nextError.message).to.equal(`'id' is required.`);
    });

    it('should generate error with invalid id', async () => {
      // Arrange
      const req = mockRequest({ params: { id: INVALID_ID } });
      const res = mockResponse();
      const next = sinon.stub();

      // Act
      await validateId('product')(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.statusCode).to.equal(404);
      expect(nextError.message).to.equal(
        `No product found with ID: '${INVALID_ID}'.`
      );
    });
  });
});
