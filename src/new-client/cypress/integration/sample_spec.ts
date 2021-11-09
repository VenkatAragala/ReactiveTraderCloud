const getTile = (symbol: string) =>
  // TODO - Add data-* to tile component
  cy.contains(symbol).parent().parent().parent().parent()

const loadLiveRates = () => {
  cy.visit("https://web.dev.reactivetrader.com/")
  cy.contains("Live Rates")
}

describe("Trade Execution", () => {
  const notional = "500,000"

  before(loadLiveRates)

  it("Formats notional", () => {
    getTile("EUR/USD")
      .find("input")
      .type("500000")
      .should("have.value", notional)
  })

  it("Shows trade response", () => {
    getTile("EUR/USD").contains("BUY").click()
    getTile("EUR/USD").contains(`You bought EUR ${notional}`)
  })

  it("Closes execution response", () => {
    getTile("EUR/USD").contains("Close").click()
    getTile("EUR/USD").should("not.contain", `You bought EUR ${notional}`)
  })
})

describe("RFQ", () => {
  const notional = "11,000,000";

  before(loadLiveRates)

  it("Shows RFQ initiation", () => {
    getTile("EUR/USD")
      .find("input")
      .type("11000000")
      .should("have.value", notional)
    getTile("EUR/USD").contains("Initiate RFQ")
    getTile("EUR/USD").contains("BUY").should("be.disabled")
    getTile("EUR/USD").contains("SELL").should("be.disabled")
  })

  it("Shows quote", () => {
    getTile("EUR/USD").contains("Initiate RFQ").click()
    getTile("EUR/USD").contains("BUY").should("not.be.disabled")
    getTile("EUR/USD").contains("SELL").should("not.be.disabled")
  })

  describe('Rejecting quote', () => {
    it('Shows expired response', () => {
      getTile("EUR/USD").contains('Reject').click();
      getTile("EUR/USD").contains('Expired')
      getTile("EUR/USD").contains('Requote')
    })
  });
  
  describe("Executing quote", () => {
    it("Shows trade response", () => {
      getTile("EUR/USD").contains("BUY").click()
      getTile("EUR/USD").contains(`You bought EUR ${notional}`)
    })

    it("Closes execution response", () => {
      getTile("EUR/USD").contains("Close").click()
      getTile("EUR/USD").should("not.contain", `You bought EUR ${notional}`)
    })
  })

 
})
