class FormLayoutsPage {
  // This adds typing to the functions.

  /**
   * Method to submit Using the Grid form with valid user credentials
   * @param {string} email - valid user email
   * @param {string} password - valid user passaword
   * @param {number} optionIndex - provide index of the option radio button, Start with 0
   */

  submitUsingTheGridForm(email, password, optionIndex) {
    cy.contains("nb-card", "Using the card").then((form) => {
      cy.wrap(form).find('[placeholder="Email"]').type(email);
      cy.wrap(form).find('[placeholder="Password"]').type(password);
      cy.wrap(form)
        .find('[type="radio"]')
        .eq(optionIndex)
        .check({ force: true });
      cy.wrap(form).contains("Sign in");
    });
  }
  submitBasicForm(email, password, isCheboxSelected) {
    cy.contains("nb-card", "Basic form").then((form) => {
      cy.wrap(form).find('[placeholder="Email"]').type(email);
      cy.wrap(form).find('[placeholder="Password"]').type(password);
      if (isCheboxSelected) {
        cy.wrap(form).find('[type="checkbox"]').check({ force: true });
      }
      cy.wrap(form).contains("Submit");
    });
  }
}

export const onFormLayoutsPage = FormLayoutsPage();
