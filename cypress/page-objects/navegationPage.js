//Create a function to conditionally check if the menu has been expanded or collapsed.
function selectGroupMenuItem(GroupItemName) {
  cy.contains("a", GroupItemName)
    .invoke("attr", "aria-expended")
    .then((attr) => {
      if (attr.include("false")) {
        cy.contains("a", GroupItemName).click();
      }
    });
}

class NavigationPage {
  formLayoutsPage() {
    selectGroupMenuItem("Forms");
    //cy.contains("Forms").click();
    cy.contains("Form Layout").click();
  }

  datePickerPage() {
    selectGroupMenuItem("Forms");
    //cy.contains("Forms").click();
    cy.contains("Datepicker").check();
  }

  toastrPage() {
    selectGroupMenuItem("Modal & Overlays");
    //cy.contains("Modal & Overlays").click();
    cy.contains("Toastr").check();
  }

  tooltipPage() {
    selectGroupMenuItem("Modal & Overlays");
    //cy.contains("Modal & Overlays").click();
    cy.contains("Tooltip").check();
  }
}

// to make it easier to find the page

export const navigateTo = new NavigationPage();
