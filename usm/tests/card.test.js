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
        it('accepts a json object', function () {
            expect(function () {
                new Card({})
            }).to.not.throw()
        })

        it('throws a TypeError, if an invalid data type is passed', function () {
            expect(function () {
                new Card(5)
            }).to.throw(TypeError)

            expect(function () {
                new Card('a string')
            }).to.throw(TypeError)

            expect(function () {
                new Card([])
            }).to.throw(TypeError)
        })

        it('throws a ReferenceError, if no data is passed at all', function () {
            expect(function () {
                new Card()
            }).to.throw(ReferenceError)
        })
    })

    describe('Card.prototype.render()', function () {
        context('valid data was passed with the constructor', function () {
            it('renders an empty Card container if the object is empty', async function () {
                const card = new Card({})

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'mock-card-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders the title field, if defined in the object', async function () {
                const card = new Card({
                    title: 'This is the title'
                })

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'mock-card-title-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders the description, if defined in the object', async function () {
                const card = new Card({
                    description: 'AS developer\nI WANT TO have the description field rendered nicely\nSO THAT I can sleep well'
                })

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'mock-card-description-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })

        // context('invalid data was passed with the constructor', function () {

        // })
    })
})
