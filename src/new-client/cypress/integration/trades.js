import { clear } from "console"

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
    cy.visit("http://localhost:1929")
    //cy.visit("https://web.uat.reactivetrader.com/")
    //cy.visit("https://web.prod.reactivetrader.com/")
    //cy.visit("https://reactivetrader.com/")




  })

  it.only("Should be able to perform trade execution", () => {
  // var list = cy.VerifyTradeExecution("EURUSD",30000,"BUY")
  //  for(var i=0;i<list.length;i++) {
  //   cy.log("from test class "+list[i])
  //   }

// positive scenarios
  cy.VerifySuccessTradeExecution("EURUSD",30000,"BUY")
  cy.VerifySuccessTradeExecution("USDJPY",40000,"BUY")
  cy.VerifySuccessTradeExecution("GBPUSD",50000,"SELL")
  cy.VerifyRejectedTradeExecution("GBPJPY",50000,"SELL")

  //negative scenarios - just to show that code will identify any anamoly
 // cy.VerifyRejectedTradeExecution("EURUSD",10000,"SELL")
 // cy.VerifySuccessTradeExecution("GBPJPY",30000,"BUY")

  })

  it("Should verify elements the number of elements in the blotter", () => {

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


  it("should verify the number of rcords based on checkbox filter", () => {
  //  for all click on icon and select one or many.. to max the records.. 
    cy.VerifyCheckboxSearchOnTrade("Status","Done")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Trader","JPW")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Status","Done","search")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Status","Rejected")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Direction","Buy")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Direction","Sell")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Deal CCY","USD")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("CCYCCY","EURUSD")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("CCYCCY","EURUSD")
    cy.reload()
    cy.VerifyCheckboxSearchOnTrade("Trader","JPW","search")
    cy.reload()
    cy.verifyCheckboxSearchforNumbers("Trade ID","Less than","2795")
    cy.verifyCheckboxSearchforNumbers("Trade ID","Greater than","2795")
     cy.verifyCheckboxSearchforNumbers("Notional","Equals", "1000000")
     cy.reload()
     cy.verifyCheckboxSearchforNumbers("Rate","Equals", "139.223")
     cy.verifyCheckboxSearchforNumbers("Rate","Greater than", "139.223")
     cy.verifyCheckboxSearchforNumbers("Rate","Less than", "139.223")
     cy.reload()
     cy.verifyCheckboxSearchforNumbers("Trade Date","Equals", "2022-01-21")
     cy.verifyCheckboxSearchforNumbers("Trade Date","Less than", "2022-01-12")
     cy.verifyCheckboxSearchforNumbers("Trade Date","Greater than", "2022-01-23")
     cy.reload()
     cy.verifyCheckboxSearchforNumbers("Value Date","Equals", "2022-01-21")
     cy.verifyCheckboxSearchforNumbers("Value Date","Less than", "2022-01-12")
     cy.verifyCheckboxSearchforNumbers("Value Date","Greater than", "2022-01-23")
   


  })

  it("should verify order  of rcords based on sort selection", () => {
    //for all click on sort icon for every header and verify if its sorted alphabetically or in ascending or descending order
  
//desceding check
    cy.reload();
    cy.VerifyDescSortOnTrade("Trade Date")
    cy.VerifyDescSortOnTrade("Direction")
    cy.VerifyDescSortOnTrade("Status")
    cy.VerifyDescSortOnTrade("Trade ID")
    cy.VerifyDescSortOnTrade("Rate")
    cy.VerifyDescSortOnTrade("Deal CCY")
    cy.VerifyDescSortOnTrade("Notional")

    cy.reload();

//ascending check
    cy.VerifyAscSortOnTrade("Trade Date")
    cy.VerifyAscSortOnTrade("Direction")
    cy.VerifyAscSortOnTrade("Status")
    cy.VerifyAscSortOnTrade("Trade ID")
    cy.VerifyAscSortOnTrade("Rate")
    cy.VerifyAscSortOnTrade("Deal CCY")
    cy.VerifyAscSortOnTrade("Notional")


    // sortbyDirection(Buy)
    //sortBYStatus(Done)

  })

  it("Should Verify the Trade Data after the Trade operation", () => {
    cy.reload();

    cy.get('caption+thead th:nth-child(2) div').should('be.visible').click()

    var tradeNumber = 0;
    const dayjs = require('dayjs')
    var todayDate = dayjs().subtract(1,'day').format('DD-MMM-YYYY')  //only for mock

    // capture the last trade id...   better create func..
    cy.get('caption[id=trades-table-heading]+thead+tbody tr:nth-child(1) td').eq(1).then(el => {
      tradeNumber = Number(el.text())
    })


    // TBD  we will call trade execution function...  be it sell or buy..  and that function will rturn a list of all prices, date, type... 
    var trade = ["", "", "Rejected", "", "Buy", "EURAUD", "EUR", "1,000,000", "1.52691", "", "JPW"]

    cy.get('caption[id=trades-table-heading]+thead+tbody tr:nth-child(1) td').each((el, index, list) => {

      if (index == 1) {
        expect(tradeNumber).to.eq(Number(el.text()))    //mock 
        //expect(tradeNumber+1).to.eq(Number(el.text()))     //real 
      }
      else if (index == 3 || index == 9) {
        expect(todayDate).to.eq(el.text())
      }

      else {
        expect(trade[index]).to.eq(el.text())
      }

    })


    // capture latest trade id, and assert that new trade id is  +1 to prev 

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
})



