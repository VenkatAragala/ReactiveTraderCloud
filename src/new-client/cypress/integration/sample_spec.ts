import { format } from "date-fns"

const getTile = (symbol: string) =>
  // TODO - Add data-* to tile component
  cy.contains(symbol).parent().parent().parent().parent()

const loadLiveRates = () => {
  cy.visit("https://web.dev.reactivetrader.com/")
  cy.contains("Live Rates")
}

const symbol = "EUR/USD"

describe("Trading Tiles", () => {
  const formattedNotional = "500,000"

  before(loadLiveRates)

  it("Should show spot date", () => {
    // TODO - Date should come from api mock
    getTile(symbol).contains(
      `SPT (${format(
        new Date().setDate(new Date().getDate() + 2),
        "dd MMM",
      ).toUpperCase()})`,
    )
  })

  it("Should show bid and ask price", () => {
    // TODO - Assert on prices when we mock the api
    expect(true).to.equal(true)
  })

  it("Should format notional input", () => {
    getTile(symbol)
      .find("input")
      .type("500000")
      .should("have.value", formattedNotional)
  })

  describe("When executing a trade", () => {
    it("Should show executing loader", () => {
      getTile(symbol).contains("BUY").click()
      getTile(symbol).contains("Executing")
    })

    it("Should show successful trade response details", () => {
      getTile(symbol).contains(`You bought EUR ${formattedNotional}`)
      // TODO - Assert on trade id, rate, price and spot when we mock the api
    })

    it("Should close execution response", () => {
      getTile(symbol).contains("Close").click()
      getTile(symbol).should(
        "not.contain",
        `You bought EUR ${formattedNotional}`,
      )
    })
  })

  describe("When symbol can not be traded", () => {
    const symbol = "GBP/JPY"

    it("Should show executing loader", () => {
      getTile(symbol).contains("BUY").click()
      getTile(symbol).contains("Executing")
    })

    it("Should show rejected trade response details", () => {
      getTile(symbol).contains("Your trade has been rejected")
    })

    it("Should close execution response", () => {
      getTile(symbol).contains("Close").click()
      getTile(symbol).should("not.contain", "Your trade has been rejected")
    })
  })

  describe("When execution take a long time", () => {
    const symbol = "EUR/JPY"

    it("Should show executing loader", () => {
      getTile(symbol).contains("BUY").click()
      getTile(symbol).contains("Executing")
    })

    it("Should show a warning message after 3 seconds", () => {
      // TODO - cypress default timeout means this assertion is successful but we should be able to test the timeout explicitly
      // cy.clock()
      // cy.tick(3000)
      // getTile(symbol).contains('Trade execution taking longer than expected', { timeout: 1 })
      getTile(symbol).contains("Trade execution taking longer than expected")
    })

    it("Should show successful trade response details", () => {
      getTile(symbol).contains(`You bought EUR 1,000,000`)
      // TODO - Assert on trade id, rate, price and spot when we mock the api
    })

    it("Should close execution response", () => {
      getTile(symbol).contains("Close").click()
      getTile(symbol).should(
        "not.contain",
        `You bought EUR ${formattedNotional}`,
      )
    })
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

    describe.skip("When reset button is clicked", () => {
      it("Should not show RFQ initiation", () => {
        getTile(symbol).should("not.have.text", "Initiate RFQ")
      })

      it("Should reset notional to 1,000,000", () => {
        // TODO - Add selector to reset button and click it
        getTile(symbol).find("input").should("have.value", "1,000,000")
      })

      it("Should re-enable buy and sell buttons", () => {
        getTile(symbol).contains("BUY").should("not.be.disabled")
        getTile(symbol).contains("SELL").should("not.be.disabled")
      })
    })
  })
})

/*
describe("When RFQ is initiated", () => {
      it("Shows quote", () => {
        getTile(symbol).contains("Initiate RFQ").click()
        getTile(symbol).contains("BUY").should("not.be.disabled")
        getTile(symbol).contains("SELL").should("not.be.disabled")
      })

      describe("Whene executing quote", () => {
        it("Shows trade response", () => {
          getTile(symbol).contains("BUY").click()
          getTile(symbol).contains(`You bought EUR ${notional}`)
        })
  
        it("Closes execution response", () => {
          getTile(symbol).contains("Close").click()
          getTile(symbol).should("not.contain", `You bought EUR ${notional}`)
        })
      })

      describe("Rejecting quote", () => {
        it("Shows expired response", () => {
          getTile(symbol).contains("Initiate RFQ").click()
          getTile(symbol).contains("Reject").click()
          getTile(symbol).contains("Expired")
          getTile(symbol).contains("Requote")
        })
      })
    })  */
