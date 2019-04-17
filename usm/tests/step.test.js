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

        it('throws a TypeError, if passed data is not a json object', function () {
            expect(function () {
                new Step('This is not an object')
            }).to.throw(TypeError)

            expect(function () {
                new Step('a string')
            }).to.throw(TypeError)

            expect(function () {
                new Step([])
            }).to.throw(TypeError)
        })

        it('throws a ReferenceError, if no data is passed at all', function () {
            expect(function () {
                new Step()
            }).to.throw(ReferenceError)
        })
    })

    describe('Step.prototype.render()', function () {
        context('valid data was passed to the constructor', function () {
            it('renders an empty Step, if the object is empty', async function () {
                const step = new Step({})

                let htmlRendered = step.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'step', 'mock-step-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders a Step card if title and/or description are given', async function () {
                const step = new Step({
                    title: 'Awesome Step'
                })

                let htmlRendered = step.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'step', 'mock-step-title-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))

                const step2 = new Step({
                    description: 'Lorem ipsum dolor sit amet ...'
                })

                let htmlRendered2 = step2.render()
                let htmlExpected2 = await fs.readFile(path.join(__dirname, 'mock-data', 'step', 'mock-step-description-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered2).should.equal(helpers.stripWhitespaces(htmlExpected2))
            })

            it('renders an empty Stories container, if empty list given', async function () {
                const step = new Step({
                    stories: []
                })

                let htmlRendered = step.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'step', 'mock-step-stories-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render all features', async function () {
                const activity = new Step({
                    title: 'Awesome Step',
                    description: 'Lorem ipsum dolor sit amet ...',
                    stories: []
                })

                let htmlRendered = activity.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'step', 'mock-step-all-features.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })

        // context('this.jsonData is invalid', function() {

        // })
    })
})
