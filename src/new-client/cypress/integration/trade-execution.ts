import { format } from "date-fns"

const getTile = (symbol: string) => cy.get(`[data-testid="tile-${symbol}"]`)

const loadLiveRates = () => {
  // cy.visit("https://web.dev.reactivetrader.com/")
  cy.visit("http://localhost:1917")
  cy.contains("Live Rates")
}

const directionMap = {
  BUY: "bought",
  SELL: "sold",
}

const executeTrade = (symbol: string, direction: "BUY" | "SELL") =>
  it("Should show executing loader", () => {
    getTile(symbol).contains(direction).click()
    getTile(symbol).contains("Executing")
  })

const tradeResponse = (
  symbol: string,
  direction: "BUY" | "SELL",
  base: string,
  notional: string,
) =>
  it("Should show successful trade response details", () => {
    getTile(symbol).contains(
      `You ${directionMap[direction]} ${base} ${notional}`,
    )
    // TODO - Assert on trade id, rate, price and spot when we mock the api
  })

const closeTradeReponse = (
  symbol: string,
  direction: "BUY" | "SELL",
  base: string,
  notional: string,
) =>
  it("Should close execution response", () => {
    getTile(symbol).contains("Close").click()
    getTile(symbol).should(
      "not.contain",
      `You ${directionMap[direction]} ${base} ${notional}`,
    )
  })

describe("Trade Execution", () => {
  const symbol = "EURUSD"

  before(loadLiveRates)

  it("Should show spot date", () => {
    // TODO - Date should come from api mock
    getTile(symbol).contains(
      `SPT (${format(new Date(), "dd MMM").toUpperCase()})`,
    )
  })

  it("Should show bid and ask price", () => {
    // TODO - Assert on prices when we mock the api
    expect(true).to.equal(true)
  })

  it("Should tick price", () => {
    getTile(symbol)
      .find('[direction="Sell"]')
      .then(($button) => {
        const val = $button.text().replace("SELL", "")
        getTile(symbol)
          .find('[direction="Sell"]')
          .should(($button) => {
            const newVal = $button.text().replace("SELL", "")
            expect(newVal).not.to.eq(val)
          })
      })
  })

  it("Should format notional input", () => {
    getTile(symbol).find("input").type("500000").should("have.value", "500,000")
  })

  it("Should reset notional", () => {
    cy.get(`[data-testid="notional-reset-${symbol}"]`).click()
    getTile(symbol).find("input").should("have.value", "1,000,000")
  })

  describe("When executing a trade", () => {
    executeTrade(symbol, "BUY")
    tradeResponse(symbol, "BUY", "EUR", "1,000,000")
    closeTradeReponse(symbol, "BUY", "EUR", "1,000,000")
  })

  describe("When symbol can not be traded", () => {
    const symbol = "GBPJPY"

    executeTrade(symbol, "BUY")

    it("Should show rejected trade response details", () => {
      getTile(symbol).contains("Your trade has been rejected")
    })

    it("Should close execution response", () => {
      getTile(symbol).contains("Close").click()
      getTile(symbol).should("not.contain", "Your trade has been rejected")
    })
  })

  describe("When execution takes a long time", () => {
    const symbol = "EURJPY"

    executeTrade(symbol, "BUY")

    it("Should show a warning message after 3 seconds", () => {
      // TODO - cypress default timeout means this assertion is successful but we should be able to test the timeout explicitly
      // cy.clock()
      // cy.tick(3000)
      // getTile(symbol).contains('Trade execution taking longer than expected', { timeout: 1 })
      getTile(symbol).contains("Trade execution taking longer than expected")
    })

    tradeResponse(symbol, "BUY", "EUR", "1,000,000")
    closeTradeReponse(symbol, "BUY", "EUR", "1,000,000")
  })

  describe("When executing a trade over limit", () => {
    it("Should show RFQ initiation", () => {
      getTile(symbol)
        .find("input")
        .type("11000000")
        .should("have.value", "11,000,000")
      getTile(symbol).contains("Initiate RFQ")
    })

    it("Should disable buy and sell buttons", () => {
      getTile(symbol).contains("BUY").should("be.disabled")
      getTile(symbol).contains("SELL").should("be.disabled")
    })

    describe("When reset button is clicked", () => {
      it("Should not show RFQ initiation", () => {
        cy.get(`[data-testid="notional-reset-${symbol}"]`).click()
        getTile(symbol).should("not.have.text", "Initiate RFQ")
      })

      it("Should reset notional to 1,000,000", () => {
        getTile(symbol).find("input").should("have.value", "1,000,000")
      })

      it("Should re-enable buy and sell buttons", () => {
        getTile(symbol).contains("BUY").should("not.be.disabled")
        getTile(symbol).contains("SELL").should("not.be.disabled")
      })
    })
  })

  describe("RFQ", () => {
    const symbol = "NZDUSD"

    it("Should have disabled bid and ask buttons", () => {
      getTile(symbol).contains("BUY").should("be.disabled")
      getTile(symbol).contains("SELL").should("be.disabled")
    })

    describe("When RFQ is initiated", () => {
      it("Should show awaiting price", () => {
        getTile(symbol).contains("Initiate RFQ").click()
        getTile(symbol).contains("Awaiting Price")
      })

      it("Should show cancel button", () => {
        getTile(symbol).contains("Cancel RFQ")
        getTile(symbol).should("not.contain", "Initiate RFQ")
      })

      it("Should enable bid and ask buttons with price", () => {
        getTile(symbol).contains("BUY").should("not.be.disabled")
        getTile(symbol).contains("SELL").should("not.be.disabled")
        // TODO - Assert on prices
      })

      it("Should show reject button", () => {
        getTile(symbol).contains("Reject")
        getTile(symbol).should("not.contain", "Cancel RFQ")
      })

      describe("When trade is executed", () => {
        executeTrade(symbol, "BUY")
        tradeResponse(symbol, "BUY", "NZD", "10,000,000")
        closeTradeReponse(symbol, "BUY", "NZD", "10,000,000")
      })
    })

    describe("When RFQ is cancelled", () => {
      it("Should show initiate RFQ button", () => {
        getTile(symbol).contains("Initiate RFQ").click()
        getTile(symbol).contains("Cancel RFQ").click()
        getTile(symbol).contains("Initiate RFQ")
        getTile(symbol).should("not.contain", "Cancel RFQ")
      })
    })

    describe("When RFQ is rejected", () => {
      it("Should show Requote button", () => {
        getTile(symbol).contains("Initiate RFQ").click()
        getTile(symbol).contains("Reject").click()
        getTile(symbol).contains("Requote")
        getTile(symbol).should("not.contain", "Reject")
      })

      it("Should show initiate RFQ button", () => {
        getTile(symbol).should("not.contain", "Requote")
        getTile(symbol).contains("Initiate RFQ")
      })
    })
  })
})

describe("Live Rates", () => {
  before(() => {
    cy.visit("http://localhost:1917")
  })

  it("Should show loader", () => {
    cy.get('[data-testid="live-rates-loader"]')
  })

  it("Should show all currency pairs", () => {
    cy.contains("Live Rates")
    cy.get('[data-testid^="tile-"]').should("have.length", 9)
  })

  it("Should show tiles in analytics view", () => {
    cy.get('[data-testid="toggleButton"]').should(
      "have.attr",
      "data-qa-id",
      "workspace-view-Analytics",
    )
    cy.get('[data-testid="historical-graph"]').should("have.length", 9)
  })

  describe("When toggle view button", () => {
    it("Should show tiles in normal view", () => {
      cy.get('[data-testid="toggleButton"]')
        .click()
        .should("have.attr", "data-qa-id", "workspace-view-Normal")
      cy.get('[data-testid="historical-graph"]').should("have.length", 0)
    })
  })

  describe("Currency navigation", () => {
    ;["EUR", "USD", "GBP", "AUD", "NZD"].forEach((currency) => {
      describe(`When ${currency} is selected`, () => {
        before(() => {
          cy.get(`[data-testid="menuButton-${currency}"]`).click()
        })

        it(`Should show only ${currency} pairs`, () => {
          cy.get('[data-testid^="tile-"]').each((tile) => {
            expect(tile.text()).to.contain(currency)
          })
        })
      })
    })

    describe(`When ALL is selected`, () => {
      before(() => {
        cy.get(`[data-testid="menuButton-Symbol(all)"]`).click()
      })

      it("Should show all currency pairs", () => {
        cy.get('[data-testid^="tile-"]').should("have.length", 9)
      })
    })
  })

  describe("Price ticking", () => {
    ;[
      "EURUSD",
      "USDJPY",
      "GBPUSD",
      "GBPJPY",
      "EURJPY",
      "AUDUSD",
      "NZDUSD",
      "EURCAD",
      "EURAUD",
    ].forEach((symbol) =>
      it(`Should tick ${symbol} price`, () => {
        getTile(symbol)
          .find('[direction="Sell"]')
          .then(($button) => {
            const val = $button.text().replace("SELL", "")
            getTile(symbol)
              .find('[direction="Sell"]')
              .should(($button) => {
                const newVal = $button.text().replace("SELL", "")
                expect(newVal).not.to.eq(val)
              })
          })
      }),
    )
  })
})
