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
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { isExportDeclaration } from "typescript"
import BlotterPage from '../integration/pages/BlotterPage'


const blotterPage = new BlotterPage();
let currentPrice = ''
let textList
let notional1
let finalList = []
let finalAmount = 0
const dayjs = require('dayjs')
var currentYear = dayjs().get('year')
let currency

// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })


Cypress.Commands.add('VerifyCurrencyOnPage', (symbol) => {
  let currency = symbol.replace('/', '')

  cy.log('').then(() => {
    cy.get('div[data-testid="tile-' + currency + '"]').scrollIntoView().should('be.visible');
  })


})

Cypress.Commands.add('VerifySuccessTradeExecution', (symbol, notional, direction) => {

  currency = symbol.replace('/', '')
  notional1 = notional

  cy.log('').then(() => {
    cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2) div:nth-child(2) input').clear().type(notional)
    cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + '] > div > div').each((el, index, list) => {
      if (index == 0) {
        currentPrice = el.find('div:nth-child(2)').text()
      }
      else {

        currentPrice = currentPrice + el.text()
      }


    })
  })

  cy.log('').then(() => {

    cy.log('current price is ' + currentPrice)
    finalAmount = Number(currentPrice) * Number(notional)




    cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + ']').click({ force: true })
    cy.wait(5000)
    cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(2)').then((el) => {


      let tradeIDList = el.text().split(' ')
      finalList.push(tradeIDList[2])

    })
    cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div[role=alert]').then((el) => {


      cy.log("Confirmation text " + el.text())

      textList = el.text().split(' ')
      finalList.push('Done')
      finalList.push(textList[14] + "-" + textList[15].replace('.', '') + "-" + currentYear)
      finalList.push(direction)
      finalList.push(textList[2] + textList[10])
      if (direction.toLowerCase() == 'buy') {
        finalList.push(textList[2])
      }
      else {
        finalList.push(textList[10])
      }
      finalList.push(textList[3])
      finalList.push(textList[8])
      finalList.push(textList[14] + "-" + textList[15].replace('.', '') + "-" + currentYear)
      finalList.push('JPW')

    })

  })

})


Cypress.Commands.add('verifySuccess', () => {

  cy.log('').then(() => {

    expect(Number(currentPrice)).to.eq(Number(finalList[7]))
    expect(Number(notional1)).to.eq(Number(textList[3].replace(/,/g, '')))
    expect(Math.round(Number(finalAmount))).to.eq(Math.round(Number(textList[11].replace(/,/g, ''))))
    expect(currency).to.eq(textList[2] + textList[10])

  })

})





Cypress.Commands.add('VerifyRejectedTradeExecution', (currency, notional, direction) => {

  let finalList = []
  const dayjs = require('dayjs')
  let currentYear = dayjs().subtract(1, 'day').format('DD-MMM-YYYY')
  let currentPrice = ''

  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2) div:nth-child(2) input').clear().type(notional)
  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + '] > div > div').each((el, index, list) => {
    if (index == 0) {
      currentPrice = el.find('div:nth-child(2)').text()
    }
    else {

      currentPrice = currentPrice + el.text()
    }


  })

  cy.get('div[data-testid="tile-' + currency + '"] > div > div > div:nth-child(2)  > div:nth-child(2) > div > button[direction=' + direction + ']').click({ force: true })
  cy.wait(2000)


  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(1)').then((el) => {



    //  finalList.push(el.text().replace('/', ''))

  })
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div:nth-child(2)').then((el) => {


    let tradeIDList = el.text().split(' ')
    finalList.push(tradeIDList[2])

  })
  cy.get('div[data-testid=tile-' + currency + '] div[role=dialog] > div[role=alert]').then((el) => {

    let confirmationText = el.text()
    cy.log("Confirmation text " + confirmationText)
    //Your trade has been rejected

    let textList = confirmationText.split(' ')
    finalList.push(textList[4])

    finalList.push(currentYear)
    finalList.push(direction)
    finalList.push(currency)
    if (direction.toLowerCase() == 'buy') {
      finalList.push(currency.substring(0, 3))
    }
    else {
      finalList.push(currency.substring(3, 6))
    }
    finalList.push(notional)
    finalList.push(currentPrice)
    finalList.push(currentYear)
    finalList.push('JPW')

    expect("rejected").to.eq(finalList[1])
    expect(currency).to.eq(finalList[4])

    cy.task('setListTrade', finalList);
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
