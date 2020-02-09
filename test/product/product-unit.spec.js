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
const { FAKE_PRODUCT, FAKE_UPDATED_PRODUCT } = require('./test-data');

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

    it('should return 200 with valid id provided', async () => {
      // Arrange
      const req = mockRequest({ params: { id: '54edb381a13ec9142b9bb353' } });
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

    // More "getProductById" tests here
  });

  describe('createProduct', () => {
    beforeEach(() => {
      sinon.stub(Product, 'create');
    });

    afterEach(() => {
      sinon.restore();
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

    it('should return 200 with valid id, valid body provided', async () => {
      // Arrange
      const req = mockRequest({
        params: { id: '54edb381a13ec9142b9bb353' },
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

    it('should return 200 with valid id provided', async () => {
      // Arrange
      const req = mockRequest({ params: { id: '54edb381a13ec9142b9bb353' } });
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

    // More "deleteProduct" tests here
  });
});
