'use strict'

const path = require('path')

const chai = require('chai')
chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Stories = require('../stories')

describe('stories', function () {
    describe('the constructor Stories(listStories, context)', function () {
        describe('the first parameter "listStories"', function () {
            it('expects an array', function () {
                expect(function () {
                    new Stories([], {})
                }).to.not.throw()
            })

            it('throws an TypeError if passed data is not a list', function () {
                expect(function () {
                    new Stories('This is not a list', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Stories({}, {})
                }).to.throw(TypeError)
            })

            it('throws an ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Stories(undefined, {})
                }).to.throw(ReferenceError)
            })
        })

        describe('the second parameter "context"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Stories([], {})
                }).to.not.throw()
            })

            it('throws an TypeError if passed data is not an object', function () {
                expect(function () {
                    new Stories([], 'This is not an object')
                }).to.throw(TypeError)

                expect(function () {
                    new Stories([], [])
                }).to.throw(TypeError)
            })

            it('throws an ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Stories([])
                }).to.throw(ReferenceError)
            })
        })

        // TODO: It puts all stories that are not tagged with a release into the generic release "__future"
        // TODO: It puts all stories that are tagged with a release that was not defined in context.releases into the generic release "__future"
    })

    describe('Stories.prototype.render()', function () {
        context('"this.jsonData" is valid', function () {
            it('can render an empty Stories container', async function () {
                const stories = new Stories([], {})

                const htmlRendered = stories.render()
                const htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'stories', 'mock-stories-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('can render multiple empty Stories into the container', async function () {
                const stories = new Stories([
                    {},
                    {},
                    {}
                ], {})

                const htmlRendered = stories.render()
                const htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'stories', 'mock-stories-multiple-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            context('"this.jsonData" has a field "releases"', () => {
                it('renders a release container for each release within the stories container', async () => {
                    const jsonStories = [
                        {
                            inRelease: 'a'
                        },
                        {
                            inRelease: 'a'
                        },
                        {
                            inRelease: 'b'
                        }
                    ]

                    const context = {
                        releases: [
                            {
                                key: 'a',
                                title: 'release a'
                            },
                            {
                                key: 'b',
                                title: 'release b'
                            }
                        ]
                    }

                    const stories = new Stories(jsonStories, context)

                    const htmlRendered = stories.render()
                    const htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'stories', 'mock-stories-in-releases.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })

                it('renders all cards that have no release specified into the "future" release at the very bottom of the map', async () => {
                    const jsonStories = [
                        {
                            inRelease: 'a'
                        },
                        { },
                        {
                            inRelease: 'b'
                        }
                    ]

                    const context = {
                        releases: [
                            {
                                key: 'a',
                                title: 'release a'
                            },
                            {
                                key: 'b',
                                title: 'release b'
                            }
                        ]
                    }

                    const stories = new Stories(jsonStories, context)

                    const htmlRendered = stories.render()
                    const htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'stories', 'mock-stories-in-releases-future.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })
            })
        })

        // context('this.jsonData is invalid', function() {

        // })
    })
})
