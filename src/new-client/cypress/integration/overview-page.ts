describe("Trades", () => {
  before(() => {
    cy.visit("http://localhost:1931")
  })

  it("Should be able to click on Adaptive Icon which navigates to the Adaptive hoempage", () => {
    cy.get('[data-qa="header__root-logo"]').should("be.visible").click()
  })

  it("Should be able to toggle lightmode/Darkmode", () => {
    cy.get('[data-testid="theme-toggle-switch"]')
    .should("be.visible").click()
  })

  it("Should be able to click on Get in touch button at the bottom", () => {
    cy.get('[data-qa="contact-us-button"]').should("be.visible").dblclick()
  })
})
