'use strict'

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Step = require('../step')

describe('step', function () {
    describe('the constructor Step()', function () {
        it('expects an object', function () {
            expect(function () {
                new Step({})
            }).to.not.throw()
        })

        it('throws an error if passed data is not a json object', function () {
            expect(function () {
                new Step('This is not an object')
            }).to.throw(TypeError)
            expect(function () {
                new Step([])
            }).to.throw(TypeError)
        })

        it('throws an error if no data is passed at all', function () {
            expect(function () {
                new Step()
            }).to.throw(ReferenceError)
        })
    })

    describe('Step.prototype.render()', function () {
        // context('this.jsonData is invalid', function() {

        // })

        context('this.jsonData is valid', function () {
            it('renders an empty Step container', async function () {
                const rawStep = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-step-empty.json'))
                const jsonSep = JSON.parse(rawStep)
                const step = new Step(jsonSep)
                let htmlRendered = step.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-step-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders an Step card with empty Cards container', async function () {
                const rawStep = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-step-stories-empty.json'))
                const jsonSep = JSON.parse(rawStep)
                const step = new Step(jsonSep)
                let htmlRendered = step.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-step-stories-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })
    })
})
