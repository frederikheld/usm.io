'use strict'

const helpers = require('./helpers')

const path = require('path')
const fs = require('fs').promises

const chai = require('chai')
chai.should()
const expect = chai.expect

const Story = require('../story')

describe('story', function () {
    describe('the constructor Story(jsonStory, context)', function () {
        describe('the first parameter "jsonStory"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Story({}, {})
                }).to.not.throw()
            })

            it('throws a TypeError if passed data is not a json object', function () {
                expect(function () {
                    new Story('This is not an object', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Story('a string', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Story([], {})
                }).to.throw(TypeError)
            })

            it('throws a ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Story(undefined, {})
                }).to.throw(ReferenceError)
            })
        })

        describe('the second parameter "context"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Story({}, {})
                }).to.not.throw()
            })

            it('throws an TypeError if passed data is not a json object', function () {
                expect(function () {
                    new Story({}, 'This is not an object')
                }).to.throw(TypeError)

                expect(function () {
                    new Story({}, 'a string')
                }).to.throw(TypeError)

                expect(function () {
                    new Story({}, [])
                }).to.throw(TypeError)
            })

            it('throws an ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Story({})
                }).to.throw(ReferenceError)
            })
        })
    })

    describe('Story.prototype.render()', function () {
        context('valid data was passed to the constructor', function () {
            it('renders a Story with an empty Card if the object is empty', async function () {
                const story = new Story({}, {})

                let htmlRendered = story.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'story', 'mock-story-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render all features', async function () {
                const activity = new Story({
                    title: 'Awesome Story',
                    description: 'Lorem ipsum dolor sit amet ...',
                    stories: []
                }, {})

                let htmlRendered = activity.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'story', 'mock-story-all-features.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })

        // context('this.jsonData is invalid', function() {

        // })
    })
})
