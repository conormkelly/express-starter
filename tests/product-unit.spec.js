const { createMockRequest, createMockResponse, mockMongooseModel } = require('./mock');
const Product = require('../models/Product');

// Import controller methods to test
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product');

describe('products', () => {

  test('getAllProducts returns 200', async () => {
    const req = createMockRequest({}, {});
    const res = createMockResponse();
    mockMongooseModel(Product, 'find', Promise.resolve([]));
    
    await getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: []
    });
  });

  test('getProductById returns 200', async () => {
    const mockProduct = {_id: 1234, name: 'Test product', price: 3.50};

    const req = createMockRequest({id: 1234}, {});
    const res = createMockResponse();
    mockMongooseModel(Product, 'findById', Promise.resolve(mockProduct));

    await getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockProduct
    });
  });

  test('createProduct returns 201', async () => {
    const mockProduct = {name: 'Test product', price: 3.50};

    const req = createMockRequest({}, mockProduct);
    const res = createMockResponse();
    mockMongooseModel(Product, 'create', Promise.resolve({_id: 1234, ...mockProduct }));

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {_id: 1234, ...mockProduct }
    });
  });

  test('updateProduct returns 200', async () => {
    const mockProduct = {name: 'Test product', price: 3.50};

    const req = createMockRequest({id: 1234}, mockProduct);
    const res = createMockResponse();
    mockMongooseModel(Product, 'findByIdAndUpdate', Promise.resolve({_id: 1234, ...mockProduct}));

    await updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {_id: 1234, ...mockProduct}
    });
  });

  test('deleteProduct returns 200', async () => {
    const mockProduct = {name: 'Test product', price: 3.50};

    const req = createMockRequest({id: 1234}, {});
    const res = createMockResponse();

    mockMongooseModel(Product, 'findByIdAndDelete', Promise.resolve({_id: 1234, ...mockProduct}));

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {_id: 1234, ...mockProduct}
    });
  });
});
