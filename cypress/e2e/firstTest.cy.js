///   <reference types="cypress" />

beforeEach("Open test application", () => {
  cy.visit("/");

  //locate element by text
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();
});

it("verify Input on screen", () => {
  //by tag
  cy.get("input");

  //by ID value
  cy.get("#inputEmail");

  //by class value
  cy.get(".input-full-width");

  //by attribute
  cy.get("[fullwidth]");

  //by attribute with value
  //always use single quotes for value in cypress because double quotes can create issues with HTML
  cy.get('[placeholder="Email"]');

  //by entire class value
  cy.get(
    '[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]'
  );

  //how to combine several attributes
  cy.get('[placeholder="Email"][fullwidth]');
  cy.get('input[placeholder="Email"]');

  // find by data-cy attrtibute
  cy.get('[data-cy="inputEmail1"]');
});

it("Cypress Locator Methods", () => {
  //Theory
  //get() - to elements on the page globally
  //find() - to find only child elements
  //contains() - to find web element by text

  // the matchCase option ignores capital letters
  cy.contains("Sign in", { matchCase: false });

  // if you looking for similar text on the page
  cy.contains('[status="warning"]', "Sign in");

  //different ways to find the same button
  cy.contains("nb-card", "Horizontal form").find("button");
  cy.contains("nb-card", "Horizontal form").contains("Sign in");
  cy.contains("nb-card", "Horizontal form").get("button");
});

it("Child Elements", () => {
  cy.contains("nb-card", "Using the Grid").find(".row").find("button");

  cy.get("nb-card").find("nb-radio-group").contains("Option 1");

  cy.get("nb-card nb-radio-group").contains("Option 1");
  //for the specific emailLabel field, look de father element first and then the child element
  cy.get("nb-card > nb-card-body [placeholder='Jane Doe']");
});

it("Parent Elements", () => {
  //parent() - to get the direct parent element of a DOM element
  //parents() - to get all parent elements of a DOM element
  //parentsUntil() - to get all parent elements up to but not including the element specified by the selector

  cy.get("#inputEmail1").parents("form").find("button");

  cy.contains("Using the Grid").parent().find("button");

  cy.get("#inputEmail1").parentsUntil("nb-card-body").fing("button");
});

//
it("Cypress Chains", () => {
  cy.get("#inputEmail1").parents("form").find("button").click();
});

it("Reusing Locators", () => {
  //dont create variables like this because of the async nature of cypress
  //

  //THIS WILL NOT WORK!!!!! DON'T DO LIKE THIS!!!!!
  // const emailField = cy.get("#inputEmail1")
  // emailField.parents("form");
  // emailField.parents("form").find("nb-radio");

  //1. Cypress Alias
  cy.get("#inputEmail1").as("inputEmail1");
  cy.get("@inputEmail1").parents("form").find("button");

  //2 Cypress then() method
  cy.get("#inputEmail1").then((inputEmail) => {
    cy.wrap(inputEmail).parents("form").find("button");
    cy.wrap(inputEmail).parents("form").find("nb-radio");
    cy.wrap("Hello").should("equal", "Hello");
    return inputEmail;
  });
});

it("Extracting values", () => {
  //1- using a jquety method
  cy.get('[for="exampleInputEmail"]').then((label) => {
    const emailLabel = label.text();

    console.log(emailLabel);
  });

  // 2- using invoke command
  cy.get('[for="exampleInputEmail"]')
    .invoke("text")
    .then((emailLabel) => {
      console.log(emailLabel);
    });
  cy.get('[for="exampleInputEmail"]').invoke("text").as("emailLabel");
  cy.get('[for="exampleInputEmail"]').should("contain", "Email address");

  // 3- Invoke attribute value
  cy.get("#exampleInputEmail1")
    .invoke("attr", "class")
    .then((classValue) => {
      console.log(classValue);
    });

  // 4- Invoke input field value
  cy.get("#exampleInput").type("hello@test.com");
  cy.get("#exampleInput")
    .invoke("prop", "value")
    .then((value) => {
      console.log(value);
    });
});

it("Assertions", () => {
  cy.get('[for="exampleInputEmail"]').should("jave.text", "Email address");
  cy.get('[for="exampleInputEmail"]').then((label) => {
    expect(label).to.have.text("Email address");
  });

  cy.get('[for="exampleInputEmail"]')
    .invoke("text")
    .then((emailLabel) => {
      expect(emailLabel).to.equal("Email address");
      cy.wrap(emailLabel).should("equal", "Email address");
    });
});

it("Timeouts", () => {
  cy.contains("Modal & Overlays").click();
  cy.contains("Dialog").click();

  cy.contains("Open with delay 10 seconds").click();

  // timeout => how long Cypress will wait for the action to be completed
  cy.get("nb-dialog-container nb-card-header", { timeout: 11000 }).should(
    "have.text",
    "Friendly reminder"
  );
});
