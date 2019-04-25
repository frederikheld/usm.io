'use strict'

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Steps = require('../steps')

describe('steps', function () {
    describe('the constructor Steps(listSteps, context)', function () {
        describe('the first parameter "listSteps"', function () {
            it('expects an array', function () {
                expect(function () {
                    new Steps([], {})
                }).to.not.throw()
            })

            it('throws a TypeError, if passed data is not a list', function () {
                expect(function () {
                    new Steps('This is not a list', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Steps({})
                }).to.throw(TypeError)
            })

            it('throws a ReferenceError, if no data is passed at all', function () {
                expect(function () {
                    new Steps(undefined, {})
                }).to.throw(ReferenceError)
            })
        })

        describe('the second parameter "context"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Steps([], {})
                }).to.not.throw()
            })

            it('throws a TypeError if passed data is not a json object', function () {
                expect(function () {
                    new Steps([], 'This is not an object')
                }).to.throw(TypeError)

                expect(function () {
                    new Steps([], 'a string')
                }).to.throw(TypeError)

                expect(function () {
                    new Steps([], [])
                }).to.throw(TypeError)
            })

            it('throws a ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Steps([])
                }).to.throw(ReferenceError)
            })
        })
    })

    describe('Steps.prototype.render()', function () {
        context('this.jsonData is valid', function () {
            it('can render an empty Steps container', async function () {
                const steps = new Steps([], {})

                let htmlRendered = steps.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'steps', 'mock-steps-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render multiple empty Steps into the container', async function () {
                const steps = new Steps([
                    {},
                    {},
                    {}
                ], {})

                let htmlRendered = steps.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'steps', 'mock-steps-multiple-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            // context('this.jsonData is invalid', function() {

            // })
        })
    })
})
