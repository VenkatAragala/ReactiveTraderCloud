import { clear } from "console"
import CommonPage from '../pages/CommonPage'


describe("Trades", () => {


  let listingCount = 0

  function getTableCount() {
    let listingCount = 0
    cy.get('caption[id=trades-table-heading]+thead+tbody').find('tr').then(count => {
      listingCount = Cypress.$(count).length

      cy.log("count " + listingCount)

    })
    cy.log("").then(() => {
      cy.log("count " + listingCount)
      return listingCount
    })


  }


  var TRADE_COUNT = 6
  var TRADE_BUY_COUNT = 3
  var TRADE_SELL_COUNT = 3
  var TRADE_DONE_COUNT = 5

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
  var randomFilters = wordsOption[Math.floor(Math.random() * wordsOption.length)]
  var filterOptions = ["Buy", "Sell", "Done", "Pending", "2022/01/14"]


  before(() => {
    cy.visit("http://localhost:1921")
    //cy.visit("https://web.uat.reactivetrader.com/")
    //cy.visit("https://web.prod.reactivetrader.com/")
    //cy.visit("https://reactivetrader.com/"
  })

  it("Should be able to perform the toggle operation", () => {

    cy.verifyToggle();
    cy.wait(3000)
    cy.verifyToggle();
  })

  it("Should Verify the Trade Data after the Trade operation", () => {

    cy.VerifySuccessTradeExecution("GBPUSD", 30000, "Buy")
    cy.task('getListTrade').then((trade) => {
      cy.log('list if trade ' + trade)
      cy.verifyBlotterAfterTrade(trade);
    })


    cy.VerifyRejectedTradeExecution("GBPJPY", 50000, "Sell")
    cy.task('getListTrade').then((trade) => {
      cy.log('list if trade ' + trade)
      cy.verifyBlotterAfterTrade(trade);
    })

    cy.VerifySuccessTradeExecution("EURJPY", 50000, "Sell")
    cy.task('getListTrade').then((trade) => {
      cy.log('list if trade ' + trade)
      cy.verifyBlotterAfterTrade(trade);
    })


    cy.VerifySuccessTradeExecution("EURCAD", 50000, "Sell")
    cy.task('getListTrade').then((trade) => {
      cy.log('list if trade ' + trade)
      cy.verifyBlotterAfterTrade(trade);
    })




    // capture latest trade id, and assert that new trade id is  +1 to prev 

  })

  it("Should be able to perform Buy EUR/USD trade execution", () => {
    cy.VerifySuccessTradeExecution("EURUSD", 30000, "BUY")
  })
  it("Should be able to perform Buy USD/JPY trade execution", () => {
    cy.VerifySuccessTradeExecution("USDJPY", 40000, "BUY")
  })
  it("Should be able to perform Buy GBP/USD trade execution", () => {
    cy.VerifySuccessTradeExecution("GBPUSD", 50000, "BUY")
  })
  it("Should be able to perform Buy GBP/JPY trade execution", () => {
    cy.VerifyRejectedTradeExecution("GBPJPY", 50000, "BUY")
  })
  it("Should be able to perform Buy EUR/JPY trade execution", () => {
    cy.VerifySuccessTradeExecution("EURJPY", 50000, "BUY")
  })
  //cy.VerifySuccessTradeExecution("AUDUSD",50000,"BUY")
  it("Should be able to perform Buy EUR/CAD trade execution", () => {
    cy.VerifySuccessTradeExecution("EURCAD", 50000, "BUY")
  })
  it("Should be able to perform Buy EUR/AUD trade execution", () => {
    cy.VerifySuccessTradeExecution("EURAUD", 50000, "BUY")
    //cy.VerifySuccessTradeExecution("NZDUSD", 50000, "BUY")
  })

  it("Should be able to perform Sell GBP/USD trade execution", () => {
    // positive scenarios
    cy.VerifySuccessTradeExecution("GBPUSD", 50000, "SELL")
  })
  it("Should be able to perform Sell GBP/JPY trade execution", () => {
    cy.VerifyRejectedTradeExecution("GBPJPY", 50000, "SELL")
  })
  it("Should be able to perform Sell EUR/JPY trade execution", () => {
    cy.VerifySuccessTradeExecution("EURJPY", 50000, "SELL")
  })
  //cy.VerifySuccessTradeExecution("AUDUSD",50000,"SELL")
  //cy.VerifySuccessTradeExecution("NZDUSD",50000,"SELL")
  it("Should be able to perform Sell EUR/CAD trade execution", () => {
    cy.VerifySuccessTradeExecution("EURCAD", 50000, "SELL")
  })
  it("Should be able to perform Sell EUR/AUD trade execution", () => {
    cy.VerifySuccessTradeExecution("EURAUD", 50000, "SELL")
  })

  it("Should be able to perform Sell EUR/USD trade execution", () => {
    cy.VerifySuccessTradeExecution("EURUSD", 30000, "SELL")
  })

  it("Should be able to perform Sell USD/JPY trade execution", () => {
    cy.VerifySuccessTradeExecution("USDJPY", 40000, "SELL")




    //negative scenarios - just to show that code will identify any anamoly
    // cy.VerifyRejectedTradeExecution("EURUSD",10000,"SELL")
    // cy.VerifySuccessTradeExecution("GBPJPY",30000,"BUY")

  })

  it.skip("Should verify elements the number of elements in the blotter", () => {

    //  funtion filtrbydirection(buy or sell)
    //function fitlerbyState()
    //function function filtrbycurrency.

    // filter by direction
    cy.get('div[role=search]').click()
    cy.get('input[data-qa="quick-filer__filter-input"]').type("Buy", { force: true })
    //   const a =getTableCount()

    cy.getTradeCount().then((test) => {
      cy.log("count " + test)
      expect(TRADE_BUY_COUNT).to.equal(test)
    })
    //  cy.log("table count "+  cy.getTradeCount())
    //expect(TRADE_BUY_COUNT).to.equal(getTableCount())
    cy.get('input[data-qa="quick-filer__filter-input"]').clear().type(filterOptions[1])
    cy.getTradeCount().then((test) => {
      cy.log("count " + test)
      expect(TRADE_SELL_COUNT).to.equal(test)
    })

    //fitler by status
    cy.get('input[data-qa="quick-filer__filter-input"]').clear().type(filterOptions[2])
    cy.getTradeCount().then((test) => {
      cy.log("count " + test)
      expect(TRADE_DONE_COUNT).to.equal(test)
    })
    //    expect(TRADE_COUNT).to.equal(getTableCount()) 
    cy.get('[data-qa="quick-filer__filter-input"]').clear().type(filterOptions[3]);
    cy.getTradeCount().then((test) => {
      cy.log("count " + test)
      expect(1).to.equal(test)
    })
    //   expect(0).to.equal(getTableCount())

    //filter by trade id
    cy.get('[data-qa="quick-filer__filter-input"]').clear().type(filterOptions[4]);
    cy.getTradeCount().then((test) => {
      cy.log("count " + test)
      expect(1).to.equal(test)
    })
    //   expect(TRADE_TODAY_COUNT).to.equal(getTableCount())
    // tbd...
    cy.get('[data-qa="quick-filer__filter-input"]').clear().type(randomItem)
    cy.get("table")
      .find("tbody")
      .then((tbody) => {
        const listingCount = Cypress.$(tbody).length
        //      expect(tbody).to.have.length(listingCount)
      })


  })


  it("should verify the number of records based on checkbox filter", () => {
    //  for all click on icon and select one or many.. to max the records.. 
    //  for all click on icon and select one or many.. to max the records.. 
    //  for all click on icon and select one or many.. to max the records.. 
    cy.VerifyCheckboxSearchOnTrade("Status", "Done")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Trader", "JPW")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Status", "Done", "search")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Status", "Rejected")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Direction", "Buy")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Direction", "Sell")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Deal CCY", "USD")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("CCYCCY", "EURUSD")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("CCYCCY", "EURUSD")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Trader", "JPW", "search")
    cy.reload()
    cy.verifyCheckboxSearchforNumbers("Trade ID", "Less than", "2795")
    cy.verifyCheckboxSearchforNumbers("Trade ID", "Greater than", "2795")
    cy.reload()
    cy.verifyCheckboxSearchforNumbers("Notional", "Equals", "50000")
    cy.reload()
    cy.verifyCheckboxSearchforNumbers("Rate", "Equals", "139.033")
    cy.verifyCheckboxSearchforNumbers("Rate", "Greater than", "139.033")
    cy.verifyCheckboxSearchforNumbers("Rate", "Less than", "139.033")
    cy.reload()
    cy.verifyCheckboxSearchforNumbers("Trade Date", "Equals", "2022-01-30")
    cy.verifyCheckboxSearchforNumbers("Trade Date", "Less than", "2022-01-31")
    cy.verifyCheckboxSearchforNumbers("Trade Date", "Greater than", "2022-01-29")
    cy.reload()
    cy.verifyCheckboxSearchforNumbers("Value Date", "Equals", "2022-01-30")
    cy.verifyCheckboxSearchforNumbers("Value Date", "Less than", "2022-01-31")
    cy.verifyCheckboxSearchforNumbers("Value Date", "Greater than", "2022-01-29")



  })

  it("should verify order of records based on Trade Date column sort selection", () => {
    //for all click on sort icon for every header and verify if its sorted alphabetically or in ascending or descending order

    //desceding check
    cy.reload();
    cy.VerifyDescSortOnTrade("Trade Date")
    cy.VerifyAscSortOnTrade("Trade Date")
  })


  it("should verify order of records based on Direction Column sort selection", () => {
    cy.reload();
    cy.VerifyDescSortOnTrade("Direction")
    cy.VerifyAscSortOnTrade("Direction")
  })

  it("should verify order of records based on Status column sort selection", () => {
    cy.reload();
    cy.VerifyDescSortOnTrade("Status")
    cy.VerifyAscSortOnTrade("Status")
  })

  it("should verify order of records based on Trade ID sort selection", () => {
    cy.reload();
    cy.VerifyDescSortOnTrade("Trade ID")
    cy.VerifyAscSortOnTrade("Trade ID")
  })

  it("should verify order of records based on Rate sort selection", () => {
    cy.reload();
    cy.VerifyDescSortOnTrade("Rate")
    cy.VerifyAscSortOnTrade("Rate")
  })

  it("should verify order of records based on Deal CCY sort selection", () => {
    cy.reload();
    cy.VerifyDescSortOnTrade("Deal CCY")
    cy.VerifyAscSortOnTrade("Deal CCY")
  })

  it("should verify order of records based on Notional Cloumn sort selection", () => {
    cy.reload();
    cy.VerifyDescSortOnTrade("Notional")
    cy.VerifyAscSortOnTrade("Notional")



    // // //ascending check
    // it("should verify order of records based on sort selection", () => {
    //   cy.reload();
    // it("should verify order of records based on sort selection", () => {
    //   cy.reload();
    // it("should verify order of records based on sort selection", () => {
    //   cy.reload();
    // it("should verify order of records based on sort selection", () => {
    //   cy.reload();
    // it("should verify order of records based on sort selection", () => {
    //   cy.reload();
    // it("should verify order of records based on sort selection", () => {
    //   cy.reload();
    // it("should verify order of records based on sort selection", () => {
    //   cy.reload();




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
    cy.get('[data-qa="quick-filter__filter-clear-icon"]').should('be.visible').click()
  })
})



