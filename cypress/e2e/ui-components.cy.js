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

it("Web tables", () => {
  cy.contains("Tables & Data").check();
  cy.contains("Smart Table").check();

  //1. How to find by text
  cy.get("tbody")
    .contains("tr", "Larry")
    .then((tableRow) => {
      cy.wrap(tableRow).find(".nb-edit").click();
      // the method type() clears the field before typing
      cy.wrap(tableRow).find('[placeholder="Age"]').clear().type("35");
      cy.wrap(tableRow).find("nb-checkmark").click();
      cy.wrap(tableRow).find("td").last().should("have.text", "35");
    });

  //2. how to find by index
  cy.get(".nb-plus").click();
  cy.get("thead tr")
    .eq(2)
    .then((tableRow) => {
      cy.wrap(tableRow).find('[placeholder="First Name"]').type("John");
      cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Doe");
      cy.wrap(tableRow).find(".nb-checkmark").click();
    });

  cy.get("tbody tr")
    .first()
    .find("td")
    .then((tableRows) => {
      cy.wrap(tableRows).eq(2).should("have.text", "John");
      cy.wrap(tableRows).eq(3).should("have.text", "Doe");
    });

  //3. Looping through table rows and columns
  const ages = [20, 30, 40];
  cy.wrap(ages).each((age) => {
    cy.get('[placeholder="Age"]').clear().type(age);
    // the method wait() is used to pause the test for a specific amount of time, this isn't the good practice
    cy.wait(500);

    cy.get("tbody tr").each((tableRow) => {
      if (age === 30) {
        cy.wrap(tableRow).find("contain.text", "No data found");
      } else {
        cy.wrap(tableRow).find("td").last().should("have.text", age);
      }
    });
  });
});

it("datepickers", () => {
  cy.contains("Forms").check();
  cy.contains("Datepicker").check();
  //in the teste locate the datapicker and select a date

  function selectDateFromCurrentDay(days) {
    let date = new Date();
    date.setData(date.getDate() + days);
    let futureDay = date.getDate();

    // toLocaleString() method returns a string with a language sensitive representation of the date
    let futureMonthLong = date.toLocaleString("default", { month: "long" });
    let futureMonthShort = date.toLocaleString("default", { month: "short" });

    // getFullYear() method returns the year of the specified date according to local time
    let futureYear = date.getFullYear();
    let dateToAssert = `Aug ${futureMonthShort} ${futureDay}, ${futureYear}`;

    cy.get("nb-calendar-view-mode")
      .invoke("text")
      .then((calendarMonthAndYear) => {
        if (
          calendarMonthAndYear.includes(futureMonthLong) ||
          !calendarMonthAndYear.includes(futureYear)
        ) {
          // in the if condition we check if the current month and year are different from the future month and year
          cy.get('[date-name="chevron-right"]').click();
          selectDateFromCurrentDay();
        } else {
          cy.get(".day-cell")
            .not(".bounding-month")
            .contains(futureDay)
            .click();
        }
      });
    return dateToAssert;
  }

  cy.get('[placeholder="Form Picker"]').then((input) => {
    cy.wrap(input).click();
    const dateToAssert = selectDateFromCurrentDay(200);
    cy.wrap(input).should("have.value", dateToAssert);
  });
});

it("Sliders", () => {
  // In the test, I change the temperature slider value

  cy.get('[tabtitle="Temperature] circle')
    .invoke("attr", "cy", "38.66")
    .invoke("attr", "cx", "57,75")
    .click();
  cy.get('[class="value temperature').should("contain.text", "18");
});

it("Drag & Drop", () => {
  cy.contains("Extra Components").click();
  cy.contains("Drag & Drop").click();

  // the trigger() with 'dragstart' and 'drop' events is used to simulate drag and drop action
  //equals to moving an element from one place to another
  cy.get("#todo-list div").first().trigger("dragstart");
  cy.get("#drop-list").trigger("drop");
});

it("iFrames", () => {
  cy.contains("Modal & Overlays").click();
  cy.contains("Dialog").click();

  cy.frameLoaded('[data-cy="esc-close-iframe"]');
  cy.iframe('[data-cy="esc-close-iframe"]')
    .contains("Open iFrame Dialog")
    .click();

  cy.contains('[data-cy="esc-close-iframe"]').then((getBody) => {
    getBody.contains("Open Dialog with esc close").click();
    cy.contains("Dismiss Dialog").click();
    getBody.contains("Open Dialog withOut esc close").click();
    cy.contains("OK").click();
  });
});
