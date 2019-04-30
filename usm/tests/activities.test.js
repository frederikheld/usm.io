'use strict'

const path = require('path')

const chai = require('chai')
chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Activities = require('../activities')

describe('activities', function () {
    describe('the constructor Activities(listActivities, context)', function () {
        describe('the first parameter "listActivities"', function () {
            it('expects an array', function () {
                expect(function () {
                    new Activities([], {})
                }).to.not.throw()
            })

            it('throws an TypeError if passed data is not a list', function () {
                expect(function () {
                    new Activities('This is not a list', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Activities({}, {})
                }).to.throw(TypeError)
            })

            it('throws an ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Activities(undefined, {})
                }).to.throw(ReferenceError)
            })
        })

        describe('the second parameter "context"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Activities([], {})
                }).to.not.throw()
            })

            it('throws an TypeError if passed data is not an object', function () {
                expect(function () {
                    new Activities([], 'This is not an object')
                }).to.throw(TypeError)

                expect(function () {
                    new Activities([], [])
                }).to.throw(TypeError)
            })

            it('throws an ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Activities([])
                }).to.throw(ReferenceError)
            })
        })
    })

    describe('Activities.prototype.render()', function () {
        context('listActivities object given with the constructor is valid', function () {
            it('can render an empty Activities container', async function () {
                const activities = new Activities([], {})

                let htmlRendered = activities.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'activities', 'mock-activities-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render multiple empty Activities into the container', async function () {
                const activities = new Activities([
                    {},
                    {},
                    {}
                ], {})

                let htmlRendered = activities.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'activities', 'mock-activities-multiple-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })

        // context('this.jsonData is invalid', function() {

        // })
    })
})
