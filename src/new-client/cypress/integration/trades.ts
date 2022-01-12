describe("Trades", () => {
  before(() => {
    cy.visit("http://localhost:1919")
    //cy.visit("https://web.uat.reactivetrader.com/")
  })

  it("Should verify elements the number of elements in the blotter", () => {
    cy.get("table")
      .find("tbody")
      .then((tbody) => {
        const listingCount = Cypress.$(tbody).length
        expect(tbody).to.have.length(listingCount)
      })
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

  var filterWord = ["Done", "Rejected", "Select All"]
  var word = filterWord[Math.floor(Math.random() * filterWord.length)]

  var wordFilter = ["Buy", "Sell", "Select All"]
  var filters = wordFilter[Math.floor(Math.random() * wordFilter.length)]

  var wordOption = [
    "Select All",
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
  var wordFilters = wordOption[Math.floor(Math.random() * wordOption.length)]

  var wordsOption = [
    "Select All",
    "USD",
    "JPY",
    "AUD",
    "NZD",
    "CAD",
    "GBP",
    "EUR",
  ]
  var randomFilters =
    wordsOption[Math.floor(Math.random() * wordsOption.length)]

  it("Should search trades using the filter", () => {
    cy.get('[data-qa="quick-filer__filter-input"]').type(randomItem)
    cy.get("table")
      .find("tbody")
      .then((tbody) => {
        const listingCount = Cypress.$(tbody).length
        expect(tbody).to.have.length(listingCount)
      })
  })

  it("Should download .CSV file", () => {
    cy.get(".svg-size").click()
    //TODO --- Check the line below amd if it downloads the file remve the line above
    //cy.get('[aria-label="Export to CSV"]')
  })

  it("should download .CSV file when filter is applied", () => {
    cy.get('[data-qa="quick-filer__filter-input"]').type(randomItem)
    cy.wait(2000)
    cy.get(".svg-size").click()
  })

  it("Should be able to cancel the search filter by clicking on 'X'", () => {
    cy.get('[data-qa="quick-filter__filter-clear-icon"]').click()
  })

  describe("Check filter checkboxes", () => {
    it("Should check if the blotter has any trades done", () => {
      cy.get("tbody").children("tr").should("have.length.greaterThan", 0)
    })

    describe("Check Trade ID column", () => {
      it("Should find the Trade ID column from the blotter", () => {
        cy.get("thead").find('[width="100"]')
        cy.contains("Trade ID")
          .invoke("show")
          .find('[aria-hidden="true"]')
          .eq(1)
          .should("be.visible")
          .should("not.be.disabled")
          .click()
      })

      it("Should be able to set the filter for Trade ID column", () => {
        cy.get('[aria-label="Filter trades by Trade ID field value"]')
          .get("select")
          .select(option)
          .should("not.be.disabled")
      })

      it("Should search by typing text using the filter instead of selecting drop down for Trade ID column", () => {
        //TODO
        cy.get('[aria-label="Primary filter value"]')
      })
    })

    describe("Check Status column", () => {
      it("Should find the Status column from the blotter", () => {
        cy.get("thead").find('[width="110"]')
        cy.contains("Status")
          .invoke("show")
          .find('[aria-hidden="true"]')
          .eq(1)
          .should("be.visible")
          .click()

        cy.contains(word).dblclick({ force: true })
      })
    })

    describe("Check Trade Date column", () => {
      it("Should find the Trade Date column from the blotter", () => {
        cy.get("thead").find('[width="130"]')
        cy.contains("Trade Date")
          .invoke("show")
          .find('[aria-hidden="true"]')
          .eq(1)
          .should("be.visible")
          .should("not.be.disabled")
          .click()
      })

      it("Should be able to set the filter for Trade ID column", () => {
        cy.get('[aria-label="Open Trade Date field filter pop up"]')
          .get("select")
          .should("not.be.disabled")
          .select(option)
      })
    })

    describe("Check Direction column", () => {
      it("Should find the Direction column from the blotter", () => {
        cy.get("thead").find('[width="110"]')
        cy.contains("Direction")
          .invoke("show")
          .find('[aria-hidden="true"]')
          .eq(1)
          .should("be.visible")
          .should("not.be.disabled")
          .click()

        cy.contains(filters).dblclick({ force: true })
      })
    })

    describe("Check CCYCCY column", () => {
      it("Should find the CCYCCY column from the blotter", () => {
        cy.get("thead").find('[width="110"]')
        cy.contains("CCYCCY")
          .invoke("show")
          .find('[aria-hidden="true"]')
          .eq(1)
          .should("be.visible")
          .should("not.be.disabled")
          .click()

        cy.contains(wordFilters).dblclick({ force: true })
      })
    })

    describe("Check Deal CCY column", () => {
      it("Should find the Deal CCY column from the blotter", () => {
        cy.get("thead").find('[width="90"]')
        cy.contains("Deal CCY")
          .invoke("show")
          .find('[aria-hidden="true"]')
          .eq(1)
          .should("be.visible")
          .should("not.be.disabled")
          .click()

        cy.contains(randomFilters).dblclick({ force: true })
      })
    })

    describe("Check Notional column", () => {
      it("Should find the Notional column from the blotter", () => {
        cy.get("thead").find('[width="120"]')
        cy.contains("Notional")
          .invoke("show")
          .find('[aria-hidden="true"]')
          .eq(1)
          .should("be.visible")
          .should("not.be.disabled")
          .click()
      })

      it("Should be able to set the filter for Notional column", () => {
        cy.get('[aria-label="Open Notional field filter pop up"]')
          .get("select")
          .select(option)
          .should("not.be.disabled")
      })
    })

    describe("Check Rate column", () => {
      it("Should find the Rate column from the blotter", () => {
        cy.get("thead")
          .find('[width="100"]')
          .eq(1)
          .find('[aria-hidden="true"]')
          .eq(1)
          .should("be.visible")
          .should("not.be.disabled")
          .click()
      })

      it("Should be able to set the filter for Rate column", () => {
        cy.get('[aria-label="Filter trades by Rate field value"]')
          .get("select")
          .select(option)
          .should("not.be.disabled")
      })
    })

    describe("Check Value Date column", () => {
      it("Should find the Value Date column from the blotter", () => {
        cy.get("thead").find('[width="120"]')
        cy.contains("Value Date")
          .invoke("show")
          .find('[aria-hidden="true"]')
          .eq(1)
          .click()
        //.should('be.visible').should("not.be.disabled").click()
      })

      it("Should be able to set the filter for Value Date column", () => {
        cy.get('[aria-label="Open Value Date field filter pop up"]')
          .get("select")
          .select(option)
          .should("not.be.disabled")
      })
    })

    describe("Check Trader column", () => {
      it("Should find the Trader column from the blotter", () => {
        cy.get("thead")
          .find('[width="110"]')
          .eq(3)
          .invoke("show")
          .find('[aria-hidden="true"]')
          .eq(1)
          .should("be.visible")
          .should("not.be.disabled")
          .click()

        if (cy.contains("JPW")) {
          cy.contains("JPW").should("not.be.disabled").dblclick({ force: true })
        }
      })
    })
  })
})
