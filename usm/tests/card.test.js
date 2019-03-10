'use strict'

const helpers = require('./helpers')

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const Card = require('../card')

describe('card', function () {
    describe('the constructor Card()', function () {
        context('json object passed', function () {
            it('takes an object', function () {
                expect(function () {
                    new Card({})
                }).to.not.throw()
            })
        })

        context('string passed', function () {
            it('reads the json object from the file at the given relative location', async function () {
                expect(function () {
                    new Card(path.join(__dirname, 'mock-data', 'mock-card-in-package', 'card-package', 'card.json'))
                }).to.not.throw()
            })

            it('throws an error if the string isn\'t a link to a file', function () {
                expect(function () {
                    new Card('blah blah')
                }).to.throw(Error)
            })
        })

        context('invalid data type passed', function () {
            it('throws an error if data is passed that is neither a string nor an object', function () {
                expect(function () {
                    new Card(5)
                }).to.throw(TypeError)

                expect(function () {
                    new Card([])
                }).to.throw(TypeError)
            })

            it('throws an error if no data is passed at all', function () {
                expect(function () {
                    new Card()
                }).to.throw(ReferenceError)
            })
        })
    })

    describe('Card.prototype.render()', function () {
        // context('this.jsonData is invalid', function () {

        // })

        context('this.jsonData is valid', function () {
            it('renders an empty Card container', function () {
                return cardRenderComparator('mock-card-empty')
            })

            it('renders title field, if defined', async function () {
                return cardRenderComparator('mock-card-title-only')
            })
            it('')

            it('renders the description, if defined', function () {
                return cardRenderComparator('mock-card-description-only')
            })

            it('assigns the release id as class with leading "release-"', function () {
                return cardRenderComparator('mock-card-with-release')
            })

            it('renders card from json file', async function () {
                const card = new Card(path.join(__dirname, 'mock-data', 'mock-card-in-package', 'card-package', 'card.json'))
                const htmlRendered = card.render()

                const htmlMocked = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-card-in-package', 'mock-card-in-package.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlMocked))
            })
        })
    })
})

/**
 * This function takes the name of a mock data file
 * and returns an Card object prepared with the data.
 *
 * This function is asynchronous due to the async
 * file operation that loads the mock data!
 *
 * @param {string} mockFilename
 */
async function cardMockupFactory (mockFilename) {
    const rawCard = await fs.readFile(path.join(__dirname, 'mock-data', mockFilename))
    const jsonCard = JSON.parse(rawCard)
    return new Card(jsonCard)
}

/**
 * This function takes the name of a mock data file
 * and returns it's contents as a string.
 *
 * Can be used to load the expected result created
 * by Card.render() from a prepared mock file.
 *
 * @param {string} mockFilename
 */
async function getMockString (mockFilename) {
    const html = await fs.readFile(path.join(__dirname, 'mock-data', mockFilename), 'utf8')
    return html
}

/**
 * Compares the rendered result of Card.render()
 * with a prepared mock result.
 *
 * @param {string} mockName
 */
async function cardRenderComparator (mockName) {
    const card = await cardMockupFactory(mockName + '.json')
    const mockHtml = await getMockString(mockName + '.html')
    const htmlRendered = card.render()
    return htmlRendered.should.equal(mockHtml)
}
