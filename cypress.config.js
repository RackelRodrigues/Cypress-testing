const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    //here we can set base url for all tests
    //after that we can use cy.visit('/') instead of full url in each test
    baseUrl: "https://playground.bondaracademy.com/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportHeight: 1280,
  viewportWidth: 720,
  //timeout global
  defaultCommandTimeout: 11000,
});
