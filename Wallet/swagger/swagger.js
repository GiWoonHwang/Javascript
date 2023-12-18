const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    failOnErrors: true,
    info: {
      title: "Wallet API",
      version: "1.0.0",
      description: "Sever API",
    },
    host: "localhost:8588",
    basePath: "/",
  },
  apis: ["./routes/*.js"],
};
const specs = swaggereJsdoc(options);
module.exports = {
  swaggerUi,
  specs,
  options,
};
