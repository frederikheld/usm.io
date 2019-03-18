'use strict'

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Stories = require('../stories')

describe('stories', function () {
    describe('the constructor Stories()', function () {
        it('expects an array', function () {
            expect(function () {
                new Stories([])
            }).to.not.throw()
        })

        it('throws an error if passed data is not a list', function () {
            expect(function () {
                new Stories('This is not a list')
            }).to.throw(TypeError)
            expect(function () {
                new Stories({})
            }).to.throw(TypeError)
        })

        it('throws an error if no data is passed at all', function () {
            expect(function () {
                new Stories()
            }).to.throw(ReferenceError)
        })
    })

    describe('Stories.prototype.render()', function () {
        // context('this.jsonData is invalid', function() {

        // })

        context('this.jsonData is valid', function () {
            it('can render an empty Stories container', async function () {
                const rawStories = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-stories-empty.json'))
                const jsonStories = JSON.parse(rawStories)
                const stories = new Stories(jsonStories)
                let htmlRendered = stories.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-stories-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render multiple empty Stories into the container', async function () {
                const rawStories = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-stories-multiple-empty.json'))
                const jsonStories = JSON.parse(rawStories)
                const stories = new Stories(jsonStories)
                let htmlRendered = stories.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-stories-multiple-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })
    })
})
