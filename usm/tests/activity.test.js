'use strict'

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Activity = require('../activity')

describe('activity', function () {
    describe('the constructor Activity(jsonActivity, context)', function () {
        describe('the first parameter "jsonActivity"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Activity({}, {})
                }).to.not.throw()
            })

            it('throws an TypeError if passed data is not a json object', function () {
                expect(function () {
                    new Activity('This is not an object', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Activity('a string', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Activity([], {})
                }).to.throw(TypeError)
            })

            it('throws an ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Activity(undefined, {})
                }).to.throw(ReferenceError)
            })
        })

        describe('the second parameter "context"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Activity({}, {})
                }).to.not.throw()
            })

            it('throws an TypeError if passed data is not a json object', function () {
                expect(function () {
                    new Activity({}, 'This is not an object')
                }).to.throw(TypeError)

                expect(function () {
                    new Activity({}, 'a string')
                }).to.throw(TypeError)

                expect(function () {
                    new Activity({}, [])
                }).to.throw(TypeError)
            })

            it('throws an ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Activity({})
                }).to.throw(ReferenceError)
            })
        })
    })

    describe('Activity.prototype.render()', function () {
        context('valid data was passed to the constructor', function () {
            it('renders a Activity with empt Card if the object is empty', async function () {
                const activity = new Activity({}, {})

                let htmlRendered = activity.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'activity', 'mock-activity-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders an empty steps container if empty list is given', async function () {
                const activity = new Activity({
                    steps: []
                }, {})

                let htmlRendered = activity.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'activity', 'mock-activity-steps-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render all features', async function () {
                const activity = new Activity({
                    title: 'Awesome Activity',
                    description: 'Lorem ipsum dolor sit amet ...',
                    steps: []
                }, {})

                let htmlRendered = activity.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'activity', 'mock-activity-all-features.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })

        // context('this.jsonData is invalid', function() {

        // })
    })
})
