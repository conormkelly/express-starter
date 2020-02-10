/**
 * Contains mock data that is used by multiple tests.
 */

const FAKE_PRODUCT = {
  _id: '54edb381a13ec9142b9bb353',
  name: 'FakeProduct',
  price: 3.50
}

const FAKE_UPDATED_PRODUCT = {
  _id: '54edb381a13ec9142b9bb353',
  name: 'UpdatedProduct',
  price: 3.50
}

const INVALID_ID = '1234';
const VALID_ID = '54edb381a13ec9142b9bb353';
const NON_EXISTENT_ID =  '54edb381a13ec9142b9bb999';

const TEST_ERROR = new Error('TEST_ERROR');

module.exports = {
  FAKE_PRODUCT,
  FAKE_UPDATED_PRODUCT,
  INVALID_ID,
  VALID_ID,
  NON_EXISTENT_ID,
  TEST_ERROR
}
