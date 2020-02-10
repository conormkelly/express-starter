# express-starter

## About

A modern express starter project featuring:

- ES6 syntax
- Example routes and controllers
- 12-factor app approach to environment variables
- Robust logging via winston and express-winston
- trace/correlation ID logging
- Unit testing

## How to run

1. Copy the `./dotenv/.env.example` file to the project root.
2. Rename to `.env`.
3. Run the below command:  

   ```sh
   npm run local
   ```

## Tests

There is a suite of unit tests written for the controller methods.
*Integration / smoke tests with Postman to follow.*

```sh
npm test
```

### TODO

- Refactor the logger
- Add Postman tests

### Endpoints

#### Products

TODO: Add more detail here.

CRUD operations defined for the below.
<http://localhost:5000/api/v1/products>
