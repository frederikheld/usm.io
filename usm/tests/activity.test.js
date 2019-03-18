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

        it('throws an error if passed data is not a json object', function () {
            expect(function () {
                new Activity('This is not an object')
            }).to.throw(TypeError)
            expect(function () {
                new Activity([])
            }).to.throw(TypeError)
        })

        it('throws an error if no data is passed at all', function () {
            expect(function () {
                new Activity()
            }).to.throw(ReferenceError)
        })
    })

    describe('Activity.prototype.render()', function () {
        // context('this.jsonData is invalid', function() {

        // })

        context('this.jsonData is valid', function () {
            it('renders an empty Activity container', async function () {
                const rawActivity = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-activity-empty.json'))
                const jsonActivity = JSON.parse(rawActivity)
                const activity = new Activity(jsonActivity)
                let htmlRendered = activity.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-activity-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders an Activity card with empty steps container', async function () {
                const rawActivity = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-activity-steps-empty.json'))
                const jsonActivity = JSON.parse(rawActivity)
                const activity = new Activity(jsonActivity)
                let htmlRendered = activity.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-activity-steps-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })
    })
})
