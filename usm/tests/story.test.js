'use strict'

const helpers = require('./helpers')

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const Story = require('../story')

describe('story', function () {
    describe('the constructor Story()', function () {
        context('json object passed', function () {
            it('takes an object', function () {
                expect(function () {
                    new Story({})
                }).to.not.throw()
            })
        })

        context('string passed', function () {
            it('reads the json object from the file at a given absolute location', async function () {
                expect(function () {
                    new Story(path.join(__dirname, 'mock-data', 'story.constructor', 'story-package', 'story.json'))
                }).to.not.throw()
            })

            it('throws an error if the string isn\'t a link to a file', function () {
                expect(function () {
                    new Story('blah blah')
                }).to.throw(RangeError)
            })
        })

        context('invalid data type passed', function () {
            it('throws a TypeError if data is passed that is neither a string nor an object', function () {
                expect(function () {
                    new Story(5)
                }).to.throw(TypeError)

                expect(function () {
                    new Story([])
                }).to.throw(TypeError)
            })

            it('throws a ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Story()
                }).to.throw(ReferenceError)
            })
        })
    })

    describe('Story.prototype.render()', function () {
        // context('this.jsonData is invalid', function () {

        // })

        context('this.jsonData is valid', function () {
            it('renders an empty Story container', async function () {
                const rawStory = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-story-empty.json'))
                const jsonStory = JSON.parse(rawStory)
                const card = new Story(jsonStory)
                let htmlRendered = card.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-story-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders a card container inside the story container, that contains a title, if title field is given', async function () {
                const rawStory = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-story-title-only.json'))
                const jsonStory = JSON.parse(rawStory)
                const story = new Story(jsonStory)
                let htmlRendered = story.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-story-title-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('assigns the release id as class with leading "release-"', async function () {
                const rawStory = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-story-with-release.json'))
                const jsonStory = JSON.parse(rawStory)
                const story = new Story(jsonStory)
                let htmlRendered = story.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-story-with-release.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })
        })

        context('object has field "link"', function () {
            it('renders a button "open package", if field "entrypoint" is given. The button points to the given entrypoint.', async function () {
                const story = new Story(path.join(__dirname, 'mock-data', 'story.render', 'story-package-with-entrypoint', 'story.json'))
                let htmlRendered = story.render()

                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'story.render', 'mock-story-package-with-entrypoint.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            context('path to file given', function () {
                it('renders the story from the file as it would render the directly passed story', async function () {
                    const story = new Story(path.join(__dirname, 'mock-data', 'story.render', 'story-package', 'story.json'))
                    let htmlRendered = story.render()

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'story.render', 'mock-story-package.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })

                it('reads the json object from the file at the absolute location given by "link" and renders the story as it would render the directly passed story', async function () {
                    const story = new Story({
                        'link': './tests/mock-data/story.render/story-package/story.json'
                    })
                    let htmlRendered = story.render()

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'story.render', 'mock-story-package.html'), 'utf-8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })

                it('overwrites fields given in the linking json file with fields given in the linked json file', async function () {
                    const story = new Story({
                        title: 'This will be overwritten by field "title" in story.json',
                        description: 'This will not be overwritten as there is no field "description" in the linked story.json',
                        link: './tests/mock-data/story.render/story-package-no-description/story.json'
                    })
                    let htmlRendered = story.render()

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'story.render', 'mock-story-package-no-description.html'), 'utf-8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })
            })

            context('path to directory given', function () {
                it('defaults to "story.json" in the given directory', async function () {
                    const story = new Story({
                        link: './tests/mock-data/story.render/story-package'
                    })
                    let htmlRendered = story.render()

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'story.render', 'mock-story-package.html'), 'utf-8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })

                it('throws an ReferenceError if "story.json" is not found', async function () {
                    expect(function () {
                        new Story({
                            link: './tests/mock-data/story.render/invalid-story-package'
                        })
                    }).to.throw(ReferenceError)
                })
            })

            context('string is neither a path to a file nor a path to a directory', function () {
                it('throws a RangeError', async function () {
                    expect(function () {
                        new Story({
                            link: 'this is not a path'
                        })
                    }).to.throw(RangeError)
                })
            })
        })
    })
})
