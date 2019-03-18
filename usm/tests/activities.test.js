'use strict'

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Activities = require('../activities')

describe('activities', function () {
    describe('the constructor Activities()', function () {
        it('expects an array', function () {
            expect(function () {
                new Activities([])
            }).to.not.throw()
        })

        it('throws an error if passed data is not a list', function () {
            expect(function () {
                new Activities('This is not a list')
            }).to.throw(TypeError)
            expect(function () {
                new Activities({})
            }).to.throw(TypeError)
        })

        it('throws an error if no data is passed at all', function () {
            expect(function () {
                new Activities()
            }).to.throw(ReferenceError)
        })
    })

    describe('Activities.prototype.render()', function () {
        // context('this.jsonData is invalid', function() {

        // })

        context('this.jsonData is valid', function () {
            it('can render an empty Activities container', async function () {
                const rawActivities = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-activities-empty.json'))
                const jsonActivities = JSON.parse(rawActivities)
                const activities = new Activities(jsonActivities)
                let htmlRendered = activities.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-activities-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render multiple empty Activities into the container', async function () {
                const rawActivities = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-activities-multiple-empty.json'))
                const jsonActivities = JSON.parse(rawActivities)
                const activities = new Activities(jsonActivities)
                let htmlRendered = activities.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-activities-multiple-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })
    })
})
