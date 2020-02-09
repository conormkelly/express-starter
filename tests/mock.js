function createMockRequest(params, body) {
  return { params, body };
}

function createMockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function mockMongooseModel(model, method, mockedReturnValue) {
  jest.spyOn(model, method)
  .mockImplementationOnce(() => mockedReturnValue);
}

module.exports = {
  createMockRequest,
  createMockResponse,
  mockMongooseModel
};
