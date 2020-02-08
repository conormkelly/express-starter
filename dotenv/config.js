const dotenv = require('dotenv');

const load = dotenv.config();

if (load.error) {
  console.error('Failed to load .env file.');
  process.exit(1);
}
