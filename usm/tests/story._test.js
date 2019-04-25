'use strict'

const helpers = require('./helpers')

const path = require('path')
const fs = require('fs').promises

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const Story = require('../story')

describe('story', function () {
    describe('the constructor Story()', function () {
        it('takes a json object', function () {
            expect(function () {
                new Story({})
            }).to.not.throw()
        })

        it('throws an error if nothing is passed', function () {
            expect(function () {
                new Story()
            }).to.throw(ReferenceError)
        })

        it('throws an error if some primitive type is passed', function () {
            // string:
            expect(function () {
                new Story('a string')
            }).to.throw(TypeError)

            // integer:
            expect(function () {
                new Story(4)
            }).to.throw(TypeError)
        })

        it('throws an error if an array is passed', function () {
            // array:
            expect(function () {
                new Story([])
            }).to.throw(TypeError)
        })
    })

    describe('Story.prototype.render()', function () {
        context('object has field "link"', function () {
            context('field "link" contains a valid link to a json file', function () {
                it('loads the story from the file and renders it', async function () {
                    const story = new Story({
                        'link': './cards/example/card.json'
                    })
                    let htmlRendered = story.render()

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'story.render', 'mock-story-package.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })
            })
        })
    })
})
