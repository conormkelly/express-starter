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
const {
  FAKE_PRODUCT,
  FAKE_UPDATED_PRODUCT,
  INVALID_ID,
  VALID_ID,
  NON_EXISTENT_ID,
  TEST_ERROR
} = require('./test-data');

//* Methods under test
const Product = require('../../models/Product');

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../../controllers/product');

describe('Product Controller - Unit tests', () => {
  describe('getAllProducts', () => {
    beforeEach(() => {
      sinon.stub(Product, 'find');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('asyncHandler should guard against rejected promise', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.stub();

      Product.find.rejects(TEST_ERROR);

      // Act
      await getAllProducts(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.name).to.equal(TEST_ERROR.name);
      expect(nextError.message).to.equal(TEST_ERROR.message);
    });

    it('should return 200 status and include array of products in response', async () => {
      // Arrange
      const req = mockRequest();
      const res = mockResponse();
      Product.find.resolves([FAKE_PRODUCT]);

      // Act
      await getAllProducts(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).calledWith({ success: true, data: [FAKE_PRODUCT] });
    });

    // More "getAllProducts" tests here
  });

  describe('getProductById', () => {
    beforeEach(() => {
      sinon.stub(Product, 'findById');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('asyncHandler should guard against rejected promise', async () => {
      // Arrange
      const req = mockRequest({ params: { id: INVALID_ID } });
      const res = mockResponse();
      const next = sinon.stub();

      Product.findById.rejects(TEST_ERROR);

      // Act
      await getProductById(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.name).to.equal(TEST_ERROR.name);
      expect(nextError.message).to.equal(TEST_ERROR.message);
    });

    it('should return 200 with valid id provided', async () => {
      // Arrange
      const req = mockRequest({ params: { id: VALID_ID } });
      const res = mockResponse();
      Product.findById.resolves(FAKE_PRODUCT);

      // Act
      await getProductById(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).calledWith({
        success: true,
        data: FAKE_PRODUCT
      });
    });

    it('should return 404 if no product found', async () => {
      // Arrange
      const req = mockRequest({ params: { id: NON_EXISTENT_ID } });
      const res = mockResponse();
      const next = sinon.stub();

      Product.findById.resolves(undefined);

      // Act
      await getProductById(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.statusCode).to.equal(404);
      expect(nextError.message).to.equal(
        `No product found with ID: ${NON_EXISTENT_ID}`
      );
    });

    // More "getProductById" tests here
  });

  describe('createProduct', () => {
    beforeEach(() => {
      sinon.stub(Product, 'create');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('asyncHandler should guard against rejected promise', async () => {
      // Arrange
      const req = mockRequest({ body: { } });
      const res = mockResponse();
      const next = sinon.stub();

      Product.create.rejects(TEST_ERROR);

      // Act
      await createProduct(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.name).to.equal(TEST_ERROR.name);
      expect(nextError.message).to.equal(TEST_ERROR.message);
    });

    it('should return 201 with valid body provided', async () => {
      // Arrange
      const req = mockRequest({ body: { name: 'FakeProduct', price: 3.5 } });
      const res = mockResponse();
      Product.create.resolves(FAKE_PRODUCT);

      // Act
      await createProduct(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith({
        success: true,
        data: FAKE_PRODUCT
      });
    });

    // More "createProduct" tests here
  });

  describe('updateProduct', () => {
    beforeEach(() => {
      sinon.stub(Product, 'findById');
      sinon.stub(Product, 'findByIdAndUpdate');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('asyncHandler should guard against rejected promise', async () => {
      // Arrange
      const req = mockRequest({ params: { id: INVALID_ID } });
      const res = mockResponse();
      const next = sinon.stub();

      Product.findById.rejects(TEST_ERROR);

      // Act
      await updateProduct(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.name).to.equal(TEST_ERROR.name);
      expect(nextError.message).to.equal(TEST_ERROR.message);
    });

    it('should return 200 with valid id, valid body provided', async () => {
      // Arrange
      const req = mockRequest({
        params: { id: VALID_ID },
        body: { name: 'UpdatedProduct', price: 3.5 }
      });

      const res = mockResponse();
      Product.findById.resolves(FAKE_PRODUCT);
      Product.findByIdAndUpdate.resolves(FAKE_UPDATED_PRODUCT);

      // Act
      await updateProduct(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        success: true,
        data: FAKE_UPDATED_PRODUCT
      });
    });

    it('should return 404 if no product found', async () => {
      // Arrange
      const req = mockRequest({ params: { id: NON_EXISTENT_ID } });
      const res = mockResponse();
      const next = sinon.stub();

      Product.findById.resolves(undefined);

      // Act
      await updateProduct(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.statusCode).to.equal(404);
      expect(nextError.message).to.equal(
        `No product found with ID: ${NON_EXISTENT_ID}`
      );
    });

    // More "updateProduct" tests here
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      sinon.stub(Product, 'findById');
      sinon.stub(Product, 'findByIdAndDelete');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('asyncHandler should guard against rejected promise', async () => {
      // Arrange
      const req = mockRequest({ params: { id: INVALID_ID } });
      const res = mockResponse();
      const next = sinon.stub();

      Product.findById.rejects(TEST_ERROR);

      // Act
      await deleteProduct(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.name).to.equal(TEST_ERROR.name);
      expect(nextError.message).to.equal(TEST_ERROR.message);
    });

    it('should return 200 with valid id provided', async () => {
      // Arrange
      const req = mockRequest({ params: { id: VALID_ID } });
      const res = mockResponse();
      Product.findById.resolves(FAKE_PRODUCT);
      Product.findByIdAndDelete.resolves(FAKE_PRODUCT);

      // Act
      await deleteProduct(req, res);

      // Assert
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        success: true,
        data: FAKE_PRODUCT
      });
    });

    it('should return 404 if no product found', async () => {
      // Arrange
      const req = mockRequest({ params: { id: NON_EXISTENT_ID } });
      const res = mockResponse();
      const next = sinon.stub();

      Product.findById.resolves(undefined);

      // Act
      await deleteProduct(req, res, next);

      // Assert
      expect(next).to.have.been.calledOnce;
      const nextError = next.args[0][0];
      expect(nextError.statusCode).to.equal(404);
      expect(nextError.message).to.equal(
        `No product found with ID: ${NON_EXISTENT_ID}`
      );
    });

    // More "deleteProduct" tests here
  });
});
