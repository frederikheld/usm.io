'use strict'

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Activity = require('../activity')

describe('activity', function () {
    describe('the constructor Activity()', function () {
        it('expects an object', function () {
            expect(function () {
                new Activity({})
            }).to.not.throw()
        })

        it('throws an TypeError if passed data is not a json object', function () {
            expect(function () {
                new Activity('This is not an object')
            }).to.throw(TypeError)

            expect(function () {
                new Activity('a string')
            }).to.throw(TypeError)

            expect(function () {
                new Activity([])
            }).to.throw(TypeError)
        })

        it('throws an ReferenceError if no data is passed at all', function () {
            expect(function () {
                new Activity()
            }).to.throw(ReferenceError)
        })
    })

    describe('Activity.prototype.render()', function () {
        context('valid data was passed to the constructor', function () {
            it('renders an empty Activity container, if the object is empty', async function () {
                const activity = new Activity({})

                let htmlRendered = activity.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'activity', 'mock-activity-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders an Activity card if title and/or description is given', async function () {
                const activity = new Activity({
                    title: 'Awesome Activity'
                })

                let htmlRendered = activity.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'activity', 'mock-activity-title-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))

                const activity2 = new Activity({
                    description: 'Lorem ipsum dolor sit amet ...'
                })

                let htmlRendered2 = activity2.render()
                let htmlExpected2 = await fs.readFile(path.join(__dirname, 'mock-data', 'activity', 'mock-activity-description-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered2).should.equal(helpers.stripWhitespaces(htmlExpected2))
            })

            it('renders an empty steps container, if empty list is given', async function () {
                const activity = new Activity({
                    steps: []
                })

                let htmlRendered = activity.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'activity', 'mock-activity-steps-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render all features', async function () {
                const activity = new Activity({
                    title: 'Awesome Activity',
                    description: 'Lorem ipsum dolor sit amet ...',
                    steps: []
                })

                let htmlRendered = activity.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'activity', 'mock-activity-all-features.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })

        // context('this.jsonData is invalid', function() {

        // })
    })
})
