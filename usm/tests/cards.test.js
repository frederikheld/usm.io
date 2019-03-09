'use strict'

const path = require('path')

const chai = require('chai')
// const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const Cards = require('../cards')

describe('cards', function () {
    describe('the constructor Cards()', function () {
        it('expects an array', () => {
            expect(() => { new Cards([]) }).to.not.throw()
        })

        it('throws an error if passed data is not a list', function () {
            expect(() => { new Cards('This is not a list') }).to.throw(TypeError)
            expect(() => { new Cards({}) }).to.throw(TypeError)
        })

        it('throws an error if no data is passed at all', function () {
            expect(() => { new Cards() }).to.throw(ReferenceError)
        })
    })

    describe('Cards.prototype.render()', function () {
        context('this.jsonData is invalid', function () {})

        context('this.jsonData is valid', function () {
            it('can render an empty Cards container', async function () {
                return cardsRenderComparator('mock-cards-empty')
            })

            it('can render multiple empty Cards into the container', async function () {
                return cardsRenderComparator('mock-cards-multiple-empty')
            })
        })
    })
})

/**
 * This function takes the name of a mock data file
 * and returns an Cards object prepared with the data.
 *
 * This function is asynchronous due to the async
 * file operation that loads the mock data!
 *
 * @param {string} mockFilename
 */
async function cardsMockupFactory (mockFilename) {
    const rawCards = await fs.readFile(path.join(__dirname, 'mock-data', mockFilename))
    const jsonCards = JSON.parse(rawCards)
    return new Cards(jsonCards)
}

/**
 * This function takes the name of a mock data file
 * and returns it's contents as a string.
 *
 * Can be used to load the expected result created
 * by Cards.render() from a prepared mock file.
 *
 * @param {string} mockFilename
 */
async function getMockString (mockFilename) {
    const html = await fs.readFile(path.join(__dirname, 'mock-data', mockFilename), { encoding: 'utf8' })
    return html
}

/**
 * Compares the rendered result of Cards.render()
 * with a prepared mock result.
 *
 * @param {string} mockName
 */
async function cardsRenderComparator (mockName) {
    const cards = await cardsMockupFactory(mockName + '.json')
    const mockHtml = await getMockString(mockName + '.html')
    const htmlRendered = cards.render()
    return htmlRendered.should.equal(mockHtml)
}
