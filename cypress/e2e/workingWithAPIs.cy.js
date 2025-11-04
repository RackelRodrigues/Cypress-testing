///   <reference types="cypress" />

it.only("first test with API", () => {
  //   cy.visit("/");
  //   cy.contains("Sign in");
  //   cy.get("[placeholder:Email]").type("cyuser@egg.com");
  //   cy.get("[placeholder:Password]").type("12345678");
  //   cy.contains("button", "Sign in").click();

  // cy.intercept("GET", "**/tags", {
  //   fixture: "tags.json",
  // });
  cy.intercept(
    { method: "GET", pathname: "**/tags" },
    {
      fixture: "tags.json",
    }
  );
  cy.intercept(
    "GET",
    "https://conduit.bondaracademy.com/api/artciles?limit=10&offeset=0",
    { fixture: "articles.json" }
  );

  // automatic login can happen here
  cy.loginToApplication();
});

it("modufy api response", () => {
  cy.intercept("GET", "**/articles*", (req) => {
    req.continue((res) => {
      res.body.articles[0].favoritesCount = 9999999;
      res.send(res.body);
    });
  });
  cy.loginToApplication();
  cy.get("app-favorite-button").first().should("countain.text", "9999999");
});

it("waiting for apis", () => {
  // cy.get("app-artivle-list").should("contain.text", "Bonder Academy")
  cy.intercept("GET", "**/articles*").as("articlesApiCall");
  cy.loginToApplication();
  cy.wait("@articlesApiCall").then((apiArticlesObject) => {
    console.log(apiArticlesObject);
    expect(apiArticlesObject.response.body.articles[0].title).to.contain(
      "Bonder Academy"
    );
  });
  cy.get("app-artivle-list")
    .invoke("text")
    .then((allArticleTexts) => {
      expect(allArticleTexts).to.contain("Bondar Academy");
    });
});

it("delete article", () => {
  cy.request({
    url: "https://conduit-api.bondaracademy.com/api/users/login",
    method: "POST",
    body: {
      user: {
        email: "cyuser34@rem.com",
        password: "welcome123",
      },
    },
  }).then((response) => {
    expect(response.status).to.equal(200);
    const accessToken = "Token" + response.body.user.token;

    cy.request({
      url: "https://conduit-api.bondaracademy.com/api/articles",
      method: "POST",
      body: {
        articles: {
          title: "Test title Cypress",
          description: "Some description",
          body: "This is a body",
          tagList: [],
        },
      },
      headers: {
        Authorization: accessToken,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.article.title).to.equal("Teste title Cypress");
    });
  });

  cy.loginToApplication();
  cy.contains("Test title Cypress").click();
  cy.intercept("GET", "**/articles*").as("articlesApiCall");
  cy.wait("@articleApiCall");
  cy.contains("button", "Deletre Article").first().click();
  cy.get("app-article-list").should("not.contain.text", "Text title Cypress");
});
