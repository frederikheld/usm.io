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

            /**
             * Link modes:
             * a) none
             * <!-- // might come later
             * b) json file linked
             *      * merges fields from linked json file with object's own fields
             * //-->
             * c) package folder linked
             *      * merges fields from _card.json_ in linked directory with object's own fields
             *      * renders button that links _index.html_ in the package's outputDir
             * d) error (link given that doesn't match one of the above criteria)
             *      * throws an error
             */
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
    })

    describe('Card.prototype.load()', function () {
        context('the object has a field "package"', async function () {
            // it('throws an ReferenceError if "package.inputDir" is not given', async function () {
            //     const card = new Card({
            //         package: { }
            //     }, {})

            //     await card.load().should.be.rejectedWith(ReferenceError, '"package" given but "package.inputDir" missing!')
            // })

            it('loads the json object from "card.json" in the directory with the given package-id in "inputDir/cards"', async function () {
                const jsonCard = {
                    package: 'card-package'
                }

                const card = new Card(jsonCard, cardContext)
                await card.load().should.be.fulfilled

                card.get('title').should.equal('Card description from package')
                card.get('description').should.equal('This description comes from the card in the package')
            })

            it('rejects with a ReferenceError if "card.json" wasn\'t found in the package\'s directory', async function () {
                const jsonCard = {
                    package: 'invalid-card-package'
                }
                const card = new Card(jsonCard, cardContext)
                await card.load().should.be.rejectedWith(ReferenceError, 'Could not read from "card.json" in package "' + jsonCard.package + '"')
            })

            it('overwrites fields from "card.json" with fields from the object', async function () {
                const jsonCard = {
                    title: 'Title from the object',
                    package: 'card-package'
                }

                const card = new Card(jsonCard, cardContext)

                await card.load()

                card.get('title').should.equal('Title from the object')
                card.get('description').should.equal('This description comes from the card in the package')
            })
        })
    })

    describe('Card.prototype.render()', function () {
        context('valid data was passed to the constructor', function () {
            it('throws an error if the jsonCard contains a package link and then Card.render() is called before Card.load() was called', function () {
                const card = new Card({
                    package: 'card-package'
                }, cardContext)

                expect(function () {
                    card.render()
                }).to.throw(Error)
            })

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

                    await card.load()

                    let htmlRendered = card.render()
                    let htmlSnippetExpected = '<button onclick="window.location.href=\'' + cardContext.outputDir + '/cards/' + jsonCard.package + '/index.html\'">Open Package</button>'

                    helpers.stripWhitespaces(htmlRendered).includes(helpers.stripWhitespaces(htmlSnippetExpected)).should.be.true
                })

                it('throws an error if Card.load() wasn\'t called before Card.render() was called', async function () {
                    const card = new Card({
                        package: 'card-package'
                    }, {})

                    expect(function () {
                        card.render()
                    }).to.throw(Error, 'Your json card description contains a link to a package that needs to be loaded before it can be rendered. Please run Card.load() before you run Card.render()!')
                })
            })

            context('the card object passed to the constructor doesn\'t contain a field "package"', function () {
                it('doesn\'t render a button', async function () {
                    const card = new Card({
                        title: 'This is the title'
                    }, {})

                    let htmlRendered = card.render()
                    let htmlSnippetNotExpected1 = '<button onclick="window.location.href=\'' + cardContext.outputDir + '/cards/'
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
