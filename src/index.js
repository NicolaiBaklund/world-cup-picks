/**
 * Main Application Index
 * Entry point for the World Cup Picks application
 */

const models = require('./models');
const services = require('./services');

module.exports = {
  ...models,
  ...services
};
