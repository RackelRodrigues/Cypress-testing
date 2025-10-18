/// <reference types='cypress' />

beforeEach("Open application", () => {
  cy.visit("/");
});

it("input fields", () => {
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();

  cy.get("#inputEmail")
    .type("hello@test.com", { delay: 200 })
    .clear()
    .type("hello");

  const name = "rackel";
  cy.contains("nb-card", "Using the card")
    .contains("Email")
    .type(`${name}@teste.com`);

  cy.get("#inputEmail")
    .should("have.value", `${name}@test.com`)
    .clear()
    .type("test@bondaryacademy.com");

  cy.contains("Auth");
  cy.contains("Login");

  cy.get("#input-email").type("test@Academy.com");
  cy.get("#input-password").type("welcome{enter}");
});

it("radio buttons", () => {
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();

  // force in Cypress => forces the action to happen and ignores validations
  cy.contains("nb-card", "Using the Grid")
    .find('[type="radio"]')
    .then((allRadioButtons) => {
      cy.wrap(allRadioButtons)
        .eq(0)
        .check({ force: true })
        .should("be.checked");

      cy.wrap(allRadioButtons).eq(1).check({ force: true });
      cy.wrap(allRadioButtons).eq(0).should("not.be.checked");
      cy.wrap(allRadioButtons).eq(2).should("be.desabled");
    });

  cy.contains("nb-card", "Using the Grid")
    .contains("label", "Option 1")
    .find("input")
    .check({ force: true });
});

it("Checkboxes", () => {
  // The check() and uncheck method is not used for clicking, but it can be used to verify or change the state of a checkbox

  cy.contains("Modal & Overlays").check();
  cy.contains("Toastr").check();

  //multiple => to check all checkboxes
  cy.get('[types="checkbox"]').click({ force: true, multiple: true });

  cy.get('[types="checkbox"]').should(before.checked);
});

it("Lists and dropdowns", () => {
  cy.contains("Modal & Overlays").check();
  cy.contains("Toastr").check();

  cy.contains("div", "Toast type:")
    .find("select")
    .select("info")
    .should("have.value", "info");

  cy.contains("div", "position:").finmd("nb-select").click();
  cy.get(".options-list").contains("bottom-right").click();
  cy.contains("div", "position:")
    .find("nb-select")
    .should("have.text", "bottom-right");

  cy.contains("div", "position:")
    .find("nb-select")
    .then((dropdown) => {
      cy.wrap(dropdown).click();
      cy.get(".options-list nb-option").each((option, index, list) => {
        cy.wrap(option).click();

        //truck to see if the option was really selected
        if (index < list.length - 1) {
          cy.wrap(dropdown).click();
        }
      });
    });
});

it("Tooltips", () => {
  cy.contains("Modal & Overlays").check();
  cy.contains("Tooltip").check();

  //The Trigger() method is used to simulate events that do not have a specific Cypress command
  cy.contains("button", "Top").trigger("mouseenter");
  cy.get("nb-tooltip").should("have.text", "This is a tooltip");
});

it("Dialog Boxes", () => {
  cy.contains("Tables & Data").check();
  cy.contains("Smart Table").check();
  // In cypress modal automatically is accepted beacuse it is headless browser

  //1. using the on method to handle window:confirm event,
  cy.get(".nb-trash").first().click();
  cy.on("window:confirm", (confirm) => {
    expect(confirm).to.equal("Are you sure you want to delete?");
  });

  //2. using the stub method to handle window:confirm event
  cy.window().then((win) => {
    cy.stub(win, "confirm").as("dialogBox").returns(true);
  });
  cy.get(".nb-trash").first().click();
  cy.get("@dialogBox").should(
    "be.calledWith",
    "Are you sure you want to delete?"
  );
});
it("Web tables", () => {});
