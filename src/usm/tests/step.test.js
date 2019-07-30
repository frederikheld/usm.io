'use strict'

const path = require('path')

const chai = require('chai')
chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Step = require('../step')

describe('step', function () {
    describe('the constructor Step(jsonStep, context)', function () {
        describe('the first parameter "jsonStep"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Step({}, {})
                }).to.not.throw()
            })

            it('throws a TypeError if passed data is not a json object', function () {
                expect(function () {
                    new Step('This is not an object', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Step('a string', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Step([], {})
                }).to.throw(TypeError)
            })

            it('throws a ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Step(undefined, {})
                }).to.throw(ReferenceError)
            })
        })

        describe('the second parameter "context"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Step({}, {})
                }).to.not.throw()
            })

            it('throws an TypeError if passed data is not a json object', function () {
                expect(function () {
                    new Step({}, 'This is not an object')
                }).to.throw(TypeError)

                expect(function () {
                    new Step({}, 'a string')
                }).to.throw(TypeError)

                expect(function () {
                    new Step({}, [])
                }).to.throw(TypeError)
            })

            it('throws an ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Step({})
                }).to.throw(ReferenceError)
            })
        })
    })

    describe('Step.prototype.render()', function () {
        context('valid data was passed to the constructor', function () {
            it('renders a Step with an empty Card if the object is empty', async function () {
                const step = new Step({}, {})

                const htmlRendered = step.render()
                const htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'step', 'mock-step-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders an empty Stories container if empty list given', async function () {
                const step = new Step({
                    stories: []
                }, {})

                const htmlRendered = step.render()
                const htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'step', 'mock-step-stories-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render all features', async function () {
                const activity = new Step({
                    title: 'Awesome Step',
                    description: 'Lorem ipsum dolor sit amet ...',
                    stories: []
                }, {})

                const htmlRendered = activity.render()
                const htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'step', 'mock-step-all-features.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })

        // context('this.jsonData is invalid', function() {

        // })
    })
})
