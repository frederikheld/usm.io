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
            it('accepts a json object', function () {
                expect(function () {
                    new Card({})
                }).to.not.throw()
            })
        })

        context('invalid data type passed', function () {
            it('throws a TypeError, if passed data is not an object', function () {
                expect(function () {
                    new Card(5)
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
    })

    describe('Card.prototype.render()', function () {
        // context('this.jsonData is invalid', function () {

        // })

        context('this.jsonData is valid', function () {
            it('renders an empty Card container', async function () {
                const rawCard = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-card-empty.json'))
                const jsonCard = JSON.parse(rawCard)
                const card = new Card(jsonCard)
                let htmlRendered = card.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-card-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders title field, if defined', async function () {
                const rawCard = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-card-title-only.json'))
                const jsonCard = JSON.parse(rawCard)
                const card = new Card(jsonCard)
                let htmlRendered = card.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-card-title-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders the description, if defined', async function () {
                const rawCard = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-card-description-only.json'))
                const jsonCard = JSON.parse(rawCard)
                const card = new Card(jsonCard)
                let htmlRendered = card.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-card-description-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })
    })
})
