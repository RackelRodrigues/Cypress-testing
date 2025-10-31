///  <reference types="cypress" />

import { onDatePickerPage } from "../page-objects/datepickerPage";
import { onFormLayoutsPage } from "../page-objects/formLayoutPage";
import { navigateTo } from "../page-objects/navegationPage";

beforeEach("open apllciation", () => {
  cy.visit("/");
  cy.openHomePage();
});

it("navegation test", () => {
  navigateTo.formLayoutsPage();
  navigateTo.datePickerPage();
  navigateTo.toastrPage();
  navigateTo.tooltipPage();
});

it("test with page object", () => {
  navigateTo.formLayoutsPage();
  onFormLayoutsPage.submitUsingTheGridForm("test@test.com", "123456", 0);
  onFormLayoutsPage.submitBasicForm("artem@test.com", "welcome", false);
  navigateTo.datePickerPage();
  onDatePickerPage.selectCommonDatePickerDateFromToday(5);
  onDatePickerPage.selectRangePickerDateFromToday(10, 50);
});
