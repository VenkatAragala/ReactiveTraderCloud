describe("Trades", () => {
  before(() => {
    cy.visit("http://localhost:1919")
  })

  it("Should be able to click on Adaptive Icon which navigates to the Adaptive hoempage", () => {
    cy.get('[data-qa="header__root-logo"]').should("be.visible").click()
  })

  it("Should be able to toggle lightmode/Darkmode", () => {
    cy.get("div").find('[width="18"]').should("be.visible").click()
  })

  it("Should be able to click on Get in touch button at the bottom", () => {
    cy.get('[data-qa="contact-us-button"]').should("be.visible").dblclick()
  })

  it("detect theme", () => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)")
    darkThemeMq.addListener((e) => {
      if (e.matches) {
        // Theme set to dark.
      } else {
        // Theme set to light.
      }
    })
  })
})
