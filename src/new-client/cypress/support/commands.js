// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --

import { isExportDeclaration } from "typescript"

// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

Cypress.Commands.add('VerifySuccessTradeExecution', (currency, quantity, direction) => {

  var currentPrice = ''
  var date;
  var confirmationText
  var textList
  var finalList = []
  var finalAmount = 0

  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2) div:nth-child(2) input').clear().type(quantity)
  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + '] > div > div').each((el, index, list) => {
    if (index == 0) {
      currentPrice = el.find('div:nth-child(2)').text()
    }
    else {

      currentPrice = currentPrice + el.text()
    }


  })

  cy.log('').then(() => {

    cy.log('current price is ' + currentPrice)
    finalAmount = Number(currentPrice) * Number(quantity)

  })


  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + ']').click({ force: true })
  cy.wait(2000)
  // cy.get('html:root').eq(0).invoke('prop', 'innerHTML').then((doc) => {
  //   cy.writeFile('pageMarkup.html', doc);
  // });
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(2)').then((el) => {

    var tradeID = el.text()
    var tradeIDList = tradeID.split(' ')
    finalList.push(tradeIDList[2])

  })
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div[role=alert]').then((el) => {

    confirmationText = el.text()
    cy.log("Confirmation text " + confirmationText)
    //You bought EUR 30,000 at a rate of 1.36348 for USD 40,904.4 settling (Spt) 25 Jan.

    textList = confirmationText.split(' ')
    finalList.push(textList[2])
    finalList.push(textList[3])
    finalList.push(textList[8])
    finalList.push(textList[10])
    finalList.push(textList[11])
    finalList.push(textList[14])
    finalList.push(textList[15])
    finalList.push(textList[2] + textList[10])


    expect(Number(currentPrice)).to.eq(Number(finalList[3]))
    expect(Number(quantity)).to.eq(Number(finalList[2].replace(/,/g, '')))
    expect(Math.round(Number(finalAmount))).to.eq(Math.round(Number(finalList[5].replace(/,/g, ''))))
    expect(currency).to.eq(finalList[8])


  })

})

Cypress.Commands.add('VerifyRejectedTradeExecution', (currency, quantity, direction) => {

  var finalList = []

  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2) div:nth-child(2) input').clear().type(quantity)

  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + ']').click({ force: true })
  cy.wait(2000)
  // cy.get('html:root').eq(0).invoke('prop', 'innerHTML').then((doc) => {
  //   cy.writeFile('pageMarkup.html', doc);
  // });

  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(1)').then((el) => {

    var tradeccy = el.text()

    finalList.push(tradeccy.replace('/', ''))

  })
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(2)').then((el) => {

    var tradeID = el.text()
    var tradeIDList = tradeID.split(' ')
    finalList.push(tradeIDList[2])

  })
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div[role=alert]').then((el) => {

    var confirmationText = el.text()
    cy.log("Confirmation text " + confirmationText)
    //Your trade has been rejected

    var textList = confirmationText.split(' ')
    finalList.push(textList[4])

    expect("rejected").to.eq(finalList[2])
    expect(currency).to.eq(finalList[0])

  })

})

Cypress.Commands.add('getTradeCount', () => {

  let listingCount = 0
  cy.get('caption[id=trades-table-heading]+thead+tbody').find('tr').then(count => {
    listingCount = Cypress.$(count).length

    cy.log("count " + listingCount)
    return cy.wrap(listingCount)
  })
})

Cypress.Commands.add('VerifyDescSortOnTrade', (name) => {

  let listingCount = 0
  var pos = 0

  // cy.get('caption+thead th:nth-child(2) div:contains("'+name+'")').should('be.visible').click()
  cy.get('caption+thead th div').each((el, index, list) => {
    //     cy.log('hello' +el.text()+" " +name)
    if (el.text() == name) {
      pos = index + 2
      if (el.text() == "Trade ID" || el.text() == "Trade Date" || el.text() == "Value Date") {
        el.click()
      }
      else {
        el.click()
        el.click()
      }
      return false;
    }
  })

  cy.log("").then(() => {
    cy.log("pos " + pos)
    var prev;
    cy.get('caption+thead+tbody tr td:nth-child(' + pos + ')').eq(0).then((el) => {

      prev = el.text()
    })
    cy.log("").then(() => {
      cy.get('caption+thead+tbody tr td:nth-child(' + pos + ')').each((el, index1, list) => {

        if (index1 < 5) {
          cy.log("current values " + el.text() + "prev " + prev)
          if (prev < el.text()) {
            cy.log("list is not in Descneding sort order")
            expect("list should be in Desc order").to.eq("list not in Desc order")
            return false;
          }
          else {
            prev = el.text()
          }
        }
        if (index1 == 5) {
          expect("list is in Desc order").to.eq("list is in Desc order")
          return false;
        }
      })
    })
  })
})

Cypress.Commands.add('VerifyAscSortOnTrade', (name) => {

  let listingCount = 0
  var pos = 0

  // cy.get('caption+thead th:nth-child(2) div:contains("'+name+'")').should('be.visible').click()
  cy.get('caption+thead th div').each((el, index, list) => {
    //     cy.log('hello' +el.text()+" " +name)
    if (el.text() == name) {
      pos = index + 2
      if (el.text() == "Trade ID" || el.text() == "Trade Date" || el.text() == "Value Date") {
        el.click()
        el.click()
      }
      else {
        el.click()
      }
      return false;
    }
  })

  cy.log("").then(() => {
    cy.log("pos " + pos)
    var prev;
    cy.get('caption+thead+tbody tr td:nth-child(' + pos + ')').eq(0).then((el) => {

      prev = el.text()
    })
    cy.log("").then(() => {
      cy.get('caption+thead+tbody tr td:nth-child(' + pos + ')').each((el, index1, list) => {

        if (index1 < 5) {
          cy.log("current values " + el.text() + "prev " + prev)
          if (pos == 8) {
            if (Number(prev.replace(',', '')) > Number(el.text().replace(',', ''))) {
              cy.log("list is not in Ascending sort order")
              expect("list should be in Acs order").to.eq("list not in Asc Order")
              return false;
            }
            else {
              prev = el.text()
            }
          }

          else {

            if (prev > el.text()) {
              cy.log("list is not in Ascending sort order")
              expect("list should be in Acs order").to.eq("list not in Asc Order")
              return false;
            }
            else {
              prev = el.text()
            }
          }

        }
        if (index1 == 5) {
          expect("list is in Asc order").to.eq("list is in Asc order")
          return false;
        }
      })
    })
  })
})

Cypress.Commands.add('VerifyCheckboxSearchOnTrade', (header, value, search = null) => {

  let listingCount = 0
  var pos = 0

  // cy.get('caption+thead th:nth-child(2) div:contains("'+name+'")').should('be.visible').click()
  cy.get('caption+thead th div').each((el, index, list) => {
    //     cy.log('hello' +el.text()+" " +name)
    if (el.text() == header) {
      pos = index + 2

      cy.get('caption+thead th:nth-child(' + pos + ') div').trigger('mouseover')
      cy.get('caption+thead th:nth-child(' + pos + ') div svg').click({ force: true, multiple: true })

      return false;
    }
  })

  cy.log(value).then(() => {

    cy.get('caption+thead th:nth-child(' + pos + ') div span:nth-child(3) div div').each((el1, index1, list) => {
      var flag = true;
      if (el1.text() == value) {
        if (search != null) {
          cy.get('caption+thead th:nth-child(' + pos + ') div span:nth-child(3) div input').clear().type(value)
          cy.get('caption+thead th:nth-child(' + pos + ') div').eq(0).click({ force: true })
        }
        else {

          el1.click();
          cy.get('caption+thead th:nth-child(' + pos + ') div').eq(0).click({ force: true })

        }
        cy.get('caption+thead+tbody tr td:nth-child(' + pos + ')').each((el, index1, list) => {
          if (el.text() != value) {
            flag = false;
            //  cy.get('caption+thead th:nth-child('+pos+') div').trigger('mouseover')
            //   cy.get('caption+thead th:nth-child('+pos+') div svg').click({force:true,multiple:true})
            //   el1.click();
            //   cy.get('caption+thead th:nth-child('+pos+') div').eq(0).click({force:true})
            expect("filter should happen correctly").to.eq("filter did not happen correctly")

            return false;
          }
        })
        if (flag == true) {
          // cy.get('caption+thead th:nth-child('+pos+') div').trigger('mouseover')
          // cy.get('caption+thead th:nth-child('+pos+') div svg').click({force:true,multiple:true})
          // el1.click();
          // cy.get('caption+thead th:nth-child('+pos+') div').eq(0).click({force:true})
          expect("filter worked fine").to.eq("filter worked fine")
          return false;
        }
      }




    })
  })

})

Cypress.Commands.add('verifyCheckboxSearchforNumbers', (header, condition, value) => {

  let listingCount = 0
  var pos = 0


  cy.get('caption+thead th div').each((el, index, list) => {
    //     cy.log('hello' +el.text()+" " +name)
    if (el.text() == header) {
      pos = index + 2

      cy.get('caption+thead th:nth-child(' + pos + ') div').trigger('mouseover')
      cy.get('caption+thead th:nth-child(' + pos + ') div svg').click({ force: true, multiple: true })

      return false;
    }
  })

  cy.log(value).then(() => {
    cy.get('caption+thead th:nth-child(' + pos + ') div span:nth-child(3) div select').select(condition)

    var flag = true;
    var d = '';

    cy.get('caption+thead th:nth-child(' + pos + ') div span:nth-child(3) div input').clear({ force: true }).type(value, { force: true })
    cy.get('caption+thead th:nth-child(' + pos + ') div').eq(0).click({ force: true })

    cy.get('caption+thead+tbody tr td:nth-child(' + pos + ')').each((el, index1, list) => {

      if (header == "Trade Date" || header == "Value Date") {
        const dayjs = require('dayjs')
        d = dayjs(el.text()).format('YYYY-MM-DD')
      }
      else {
        d = el.text()
      }
      switch (condition) {
        case 'Equals':

          //    cy.log("equals "+ Number(d.replace(/[,-]/g,''))+"  "+Number(value.replace(/[,-]/g,'')))
          if (Number(d.replace(/[,-]/g, '')) != Number(value.replace(/[,-]/g, ''))) {

            flag = false;

            cy.log('').then(() => { expect("filter should happen correctly").to.eq("filter did not happen correctly") })

            return false;
          }


          break;

        case 'Less than':
          if (Number(d.replace(/[,-]/g, '')) >= Number(value.replace(/[,-]/g, ''))) {
            flag = false;

            expect("filter should happen correctly").to.eq("filter did not happen correctly")

            return false;
          }


          break;

        case 'Greater than':
          if (Number(d.replace(/[,-]/g, '')) <= Number(value.replace(/[,-]/g, ''))) {
            flag = false;

            expect("filter should happen correctly").to.eq("filter did not happen correctly")

            return false;
          }


          break;
      }
    })

    if (flag == true) {

      expect("filter worked fine").to.eq("filter worked fine")
      return false;
    }






  })

})

//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})


