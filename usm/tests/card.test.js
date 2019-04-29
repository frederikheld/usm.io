'use strict'

const helpers = require('./helpers')

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const fs = require('fs').promises

const Card = require('../card')

describe('card', function () {
    const cardContext = {
        inputDir: path.join(__dirname, 'mock-data', 'card', 'input'),
        outputDir: path.join(__dirname, 'temp')
    }
    describe('the constructor Card(jsonCard, context)', function () {
        describe('the first parameter "jsonCard"', function () {
            it('is expected to be a json object', function () {
                expect(function () {
                    new Card({}, {})
                }).to.not.throw()
            })

            it('throws a TypeError if something other than an object is passed', function () {
                expect(function () {
                    new Card(5, {})
                }).to.throw(TypeError)

                expect(function () {
                    new Card('a string', {})
                }).to.throw(TypeError)

                expect(function () {
                    new Card([], {})
                }).to.throw(TypeError)
            })

            it('throws a ReferenceError if nothing is passed at all', function () {
                expect(function () {
                    new Card(undefined, {})
                }).to.throw(ReferenceError)
            })
        })

        describe('the second parameter "context"', function () {
            it('expects an object', function () {
                expect(function () {
                    new Card({}, {})
                }).to.not.throw()
            })

            it('throws an TypeError if passed data is not a json object', function () {
                expect(function () {
                    new Card({}, 'This is not an object')
                }).to.throw(TypeError)

                expect(function () {
                    new Card({}, 'a string')
                }).to.throw(TypeError)

                expect(function () {
                    new Card({}, [])
                }).to.throw(TypeError)
            })

            it('throws an ReferenceError if no data is passed at all', function () {
                expect(function () {
                    new Card({})
                }).to.throw(ReferenceError)
            })
        })

        context('the object has a field "package"', function () {
            // it('throws an ReferenceError if "package.inputDir" is not given', function () {
            //     const card = new Card({
            //         package: { }
            //     }, {})

            //     card.load().should.be.rejectedWith(ReferenceError, '"package" given but "package.inputDir" missing!')
            // })

            it('loads the json object from "card.json" in the directory with the given package-id in "inputDir/cards"', function () {
                const jsonCard = {
                    package: 'card-package'
                }

                let card
                expect(function () {
                    card = new Card(jsonCard, cardContext)
                }).to.not.throw()

                card.get('title').should.equal('Card description from package')
                card.get('description').should.equal('This description comes from the card in the package')
            })

            it('throws a ReferenceError if "card.json" wasn\'t found in the package\'s directory', function () {
                const jsonCard = {
                    package: 'invalid-card-package'
                }

                expect(function () {
                    new Card(jsonCard, cardContext)
                }).throw(ReferenceError, 'Could not read from "card.json" in package "' + jsonCard.package + '"')
            })

            it('overwrites fields from "card.json" with fields from the object', function () {
                const jsonCard = {
                    title: 'Title from the object',
                    package: 'card-package'
                }

                const card = new Card(jsonCard, cardContext)

                card.get('title').should.equal('Title from the object')
                card.get('description').should.equal('This description comes from the card in the package')
            })
        })
    })

    describe('Card.prototype.render()', function () {
        context('valid data was passed to the constructor', function () {
            it('renders an empty Card container, if the object is empty', async function () {
                const card = new Card({}, {})

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'expected-output', 'card-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders the title, if defined in the object', async function () {
                const card = new Card({
                    title: 'This is the title'
                }, {})

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'expected-output', 'card-title-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders the description, if defined in the object', async function () {
                const card = new Card({
                    description: 'AS developer\nI WANT TO have the description field rendered nicely\nSO THAT I can sleep well'
                }, {})

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'expected-output', 'card-description-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders the title above of the description', async function () {
                const card = new Card({
                    description: 'AS developer\nI WANT TO have the description field rendered nicely\nSO THAT I can sleep well',
                    title: 'This is the title'
                }, {})

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'expected-output', 'card-title-and-description.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            context('the card object passed to the constructor contains a field "package"', async function () {
                it('renders a button that links to "index.html" in the card\'s package directory generated in "context.outputDir"', async function () {
                    const jsonCard = {
                        package: 'card-package'
                    }

                    const card = new Card(jsonCard, cardContext)

                    let htmlRendered = card.render()
                    let htmlSnippetExpected = '<button class="open-package" onclick="window.location.href=\'' + cardContext.outputDir + '/cards/' + jsonCard.package + '/index.html\'">Open Package</button>'

                    helpers.stripWhitespaces(htmlRendered).includes(helpers.stripWhitespaces(htmlSnippetExpected)).should.be.true
                })
            })

            context('the card object passed to the constructor doesn\'t contain a field "package"', function () {
                it('doesn\'t render a button', async function () {
                    const card = new Card({
                        title: 'This is the title'
                    }, {})

                    let htmlRendered = card.render()
                    let htmlSnippetNotExpected1 = '<button class="open-package" onclick="window.location.href=\'' + cardContext.outputDir + '/cards/'
                    let htmlSnippetNotExpected2 = '/index.html\'">Open Package</button>'

                    helpers.stripWhitespaces(htmlRendered).includes(helpers.stripWhitespaces(htmlSnippetNotExpected1)).should.be.false
                    helpers.stripWhitespaces(htmlRendered).includes(helpers.stripWhitespaces(htmlSnippetNotExpected2)).should.be.false
                })
            })
        })

        // context('invalid data was passed with the constructor', function () {

        // })
    })
})
