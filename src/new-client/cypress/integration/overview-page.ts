describe("Trades", () => {
  before(() => {
    cy.visit("http://localhost:1920")
  })

  it("Should be able to click on Adaptive Icon which navigates to the Adaptive hoempage", () => {
    cy.get(".sc-daBunf > .sc-eKYRIR").should("be.visible").click()
  })

  it("Should be able to toggle lightmode", () => {
    cy.get(".sc-kHWWYL > svg").should("be.visible").click()
    cy.wait(3000)
  })

  it("Should be able to toggle darkmode", () => {
    cy.get(".sc-hOPeYd").should("be.visible").click()
  })

  it("Should be able to click on Get in touch button at the bottom", () => {
    cy.get(":nth-child(2) > .sc-EZqKI").should("be.visible").dblclick()
  })
})
