function selectDateFromCurrentDay(day) {
  let date = new Date();
  date.setData(date.getDate() + day);
  let futureDay = date.getDate();

  let futureMonthLong = date.toLocaleString("default", { month: "long" });
  let futureMonthShort = date.toLocaleString("default", { month: "short" });

  let futureYear = date.getFullYear();
  let dateToAssert = `Aug ${futureMonthShort} ${futureDay}, ${futureYear}`;

  cy.get("nb-calendar-view-mode")
    .invoke("text")
    .then((calendarMonthAndYear) => {
      if (
        calendarMonthAndYear.includes(futureMonthLong) ||
        !calendarMonthAndYear.includes(futureYear)
      ) {
        cy.get('[date-name="chevron-right"]').click();
        selectDateFromCurrentDay();
      } else {
        cy.get(".day-cell").not(".bounding-month").contains(futureDay).click();
      }
    });
  return dateToAssert;
}

class DatePickerPage {
  /**
   *
   * @param {number} numberOfDaysFromToday
   * @param {number} numberOfDaysFromTodayStart
   * @param {number} numberOfDaysFromTodayEnd
   *
   */

  selectCommonDatePickerDateFromToday(numberOfDaysFromToday) {
    cy.get('[placeholder="Form Picker"]').then((input) => {
      cy.wrap(input).click();
      const dateToAssert = selectDateFromCurrentDay(numberOfDaysFromToday);
      cy.wrap(input).should("have.value", dateToAssert);
    });
  }

  selectRangePickerDateFromToday(
    numberOfDaysFromTodayStart,
    numberOfDaysFromTodayEnd
  ) {
    cy.get('[placeholder="Range Picker"]').then((input) => {
      cy.wrap(input).click();
      const dateToAssertStart = selectDateFromCurrentDay(
        numberOfDaysFromTodayStart
      );
      const dateToAssertEnd = selectDateFromCurrentDay(
        numberOfDaysFromTodayEnd
      );
      const finalDate = `${dateToAssertStart} - ${dateToAssertEnd}`;
      cy.wrap(input).should("have.value", finalDate);
    });
  }
}

export const onDatePickerPage = new DatePickerPage();
