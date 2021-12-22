describe("Trades", () => {
  before(() => {
    cy.visit("http://localhost:1917")
  })

  var keyWords = [
    "BUY",
    "SELL",
    "DONE",
    "JPW",
    "REJECTED",
    "EURUSD",
    "USDJPY",
    "GBPUSD",
    "GBPJPY",
    "EURJPY",
    "AUDUSD",
    "NZDUSD",
    "EURCAD",
    "EURAUD",
  ]
  var randomItem = keyWords[Math.floor(Math.random() * keyWords.length)]

  it("Should search trades using the filter", () => {
    cy.get(".sc-igOmtu").type(randomItem)
    cy.wait(1000)
    cy.get(".sc-gGuRsA > svg > path").click()
  })

  it("Should download .CSV file", () => {
    cy.get(".svg-size").click()
  })

  it("should download .CSV file when filter is applied", () => {
    cy.get(".sc-igOmtu").type(randomItem)
    cy.wait(2000)
    cy.get(".svg-size").click()
  })

  it("Should be able to cancel the search filter by clicking on 'X'", () => {
    cy.get(".sc-gGuRsA > svg > path").click()
  })

  describe("Check filter checkboxes", () => {
    var words = [
      "Equals",
      "Not equal",
      "Less than",
      "Less than or equals",
      "Greater than",
      "Greater than or equals",
      "In range",
    ]
    var option = words[Math.floor(Math.random() * words.length)]

    it("Should be able to click on checkbox filter for Trade ID column", () => {
      cy.get(".hWSVxc > .sc-hkoqWr > :nth-child(2)")
        .should("be.visible")
        .click()
      cy.get(".sc-JsfZP").select(option)
    })

    var filterWord = ["Done", "Rejected"]
    var word = filterWord[Math.floor(Math.random() * filterWord.length)]

    it("should be able to click on checkbox filter in the dropdown for Status column", () => {
      //checking if cypress can locate the element
      cy.get(":nth-child(3) > .sc-hkoqWr > :nth-child(2)")
        .should("be.visible")
        .click()
      cy.get(".sc-hYRTwp").type(word)
      cy.contains("Done").dblclick({ force: true })
      cy.contains("Rejected").dblclick({ force: true })
      cy.contains("Select All").dblclick({ force: true })
      cy.get(":nth-child(3) > .sc-hkoqWr").contains("Status").click()
    })

    it("Should be able to click on checkbox filter in the dropdown for Trade date column", () => {
      //Checking if cypress can detect the elements
      cy.get(".kckzpb > .sc-hkoqWr > :nth-child(2)")
        .should("be.visible")
        .click()
      cy.contains("Equals").click({ force: true })
    })

    it("Should be able to click on checkbox filter for Direction column", () => {
      cy.get(":nth-child(5) > .sc-hkoqWr > :nth-child(2)")
        .should("be.visible")
        .click()
      cy.contains("Buy").dblclick({ force: true })
      cy.wait(1000)
      cy.contains("Sell").dblclick({ force: true })
      cy.wait(1000)
      cy.get(":nth-child(5) > .sc-hkoqWr").click()
    })

    it("Should be able to click on checkbox filter for CCYCCY column", () => {
      cy.get(":nth-child(6) > .sc-hkoqWr > :nth-child(2)")
        .should("be.visible")
        .click()
      cy.contains("GBPUSD").dblclick({ force: true })
      cy.contains("GBPJPY").dblclick({ force: true })
      cy.contains("AUDUSD").dblclick({ force: true })
      cy.contains("USDJPY").dblclick({ force: true })
      cy.contains("EURUSD").dblclick({ force: true })
      cy.contains("EURJPY").dblclick({ force: true })
    })

    it("Should be able to click on checkbox filter for DEALCCY column", () => {
      cy.get(".uQWbs > .sc-hkoqWr > :nth-child(2)").should("be.visible").click()
      cy.get(".bLqgfz").dblclick({ force: true })
      cy.get(".sc-bUQyIj > :nth-child(3)").dblclick({ force: true })
      cy.get(".sc-bUQyIj > :nth-child(4)").dblclick({ force: true })
      cy.get(".sc-bUQyIj > :nth-child(5)").dblclick({ force: true })
      cy.get(".sc-bUQyIj > :nth-child(6)").dblclick({ force: true })
      cy.get(".sc-bUQyIj > :nth-child(7)").dblclick({ force: true })
      cy.get(".uQWbs > .sc-hkoqWr").click()
    })

    it("Should be able to click on checkbox filter for Notional Column", () => {
      cy.get(".jEQuGk > .sc-hkoqWr > :nth-child(2)")
        .should("be.visible")
        .click()
      cy.get(".sc-JsfZP").select(option)
    })

    it("Should be able to click on checkbox filter for Rate column", () => {
      cy.get(".eqsjEG > .sc-hkoqWr > :nth-child(2)")
        .should("be.visible")
        .click()
      cy.get(".sc-JsfZP").select(option)
    })

    it("Should be able to click on checkbox filter for Value Date column", () => {
      cy.get(".gIxNWS > .sc-hkoqWr > :nth-child(2)").click()
      cy.get(".sc-JsfZP").select(option)
    })

    it("Should be able to click on checkbox filter for Trader column", () => {
      cy.get(":nth-child(11) > .sc-hkoqWr > :nth-child(2)").click()
      cy.contains("Select All").dblclick({ force: true })
      cy.contains("JPW").dblclick({ force: true })
    })
  })
})
