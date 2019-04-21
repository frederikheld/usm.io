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

describe.only('card', function () {
    describe('the constructor Card()', function () {
        it('accepts a json object', function () {
            expect(function () {
                new Card({})
            }).to.not.throw()
        })

        it('throws a TypeError if something other than an object is passed', function () {
            expect(function () {
                new Card(5)
            }).to.throw(TypeError)

            expect(function () {
                new Card('a string')
            }).to.throw(TypeError)

            expect(function () {
                new Card([])
            }).to.throw(TypeError)
        })

        it('throws a ReferenceError if nothing is passed at all', function () {
            expect(function () {
                new Card()
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

    describe('Card.prototype.load()', function () {
        context('the object has a field "package"', async function () {
            it('throws an ReferenceError if "package.inputDir" is not given', async function () {
                const card = new Card({
                    package: { }
                })

                await card.load().should.be.rejectedWith(ReferenceError, '"package" given but "package.inputDir" missing!')
            })

            it('loads the json object from "card.json" in "package.inputDir"', async function () {
                const card = new Card({
                    package: {
                        inputDir: './mock-data/card/card-package/'
                    }
                })

                const cwd = process.cwd()
                process.chdir(__dirname)

                await card.load().should.be.fulfilled

                process.chdir(cwd)

                // NOTE: process.cwd() is the directory from where the tests were run. So usually
                //       the root path of the package. As we are dealing with paths relative to
                //       this file, we have to change process.cwd() to __dirname.

                card.get('title').should.equal('Card description from package')
                card.get('description').should.equal('This description comes from the card in the package')
            })

            it('throws an error if "card.json" wasn\'t found in "package.inputDir"', async function () {
                const jsonCard = {
                    package: {
                        inputDir: './mock-data/card/invalid-card-package/'
                    }
                }
                const card = new Card(jsonCard)

                const cwd = process.cwd()
                process.chdir(__dirname)

                await card.load().should.be.rejectedWith(ReferenceError, 'Could not read from "card.json" in ' + jsonCard.package.inputDir)

                process.chdir(cwd)
            })

            it('overwrites fields from "card.json" with fields from the object', async function () {
                const card = new Card({
                    title: 'Title from the object',
                    package: {
                        inputDir: './mock-data/card/card-package/'
                    }
                })

                const cwd = process.cwd()
                process.chdir(__dirname)

                await card.load()

                process.chdir(cwd)

                card.get('title').should.equal('Title from the object')
                card.get('description').should.equal('This description comes from the card in the package')
            })
        })
    })

    describe('Card.prototype.render()', function () {
        context('valid data was passed to the constructor', function () {
            it('renders an empty Card container, if the object is empty', async function () {
                const card = new Card({})

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'mock-card-empty.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders the title, if defined in the object', async function () {
                const card = new Card({
                    title: 'This is the title'
                })

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'mock-card-title-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders the description, if defined in the object', async function () {
                const card = new Card({
                    description: 'AS developer\nI WANT TO have the description field rendered nicely\nSO THAT I can sleep well'
                })

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'mock-card-description-only.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            it('renders the title above of the description', async function () {
                const card = new Card({
                    description: 'AS developer\nI WANT TO have the description field rendered nicely\nSO THAT I can sleep well',
                    title: 'This is the title'
                })

                let htmlRendered = card.render()
                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'mock-card-title-and-description.html'), 'utf8')

                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            })

            context('the object passed to the constructor contains a field "package"', async function () {
                it('renders a button that links to "index.html" in "package.outputDir"', async function () {
                    const card = new Card({
                        package: {
                            inputDir: './mock-data/card/card-package/',
                            outputDir: './temp/card/card-package/'
                        }
                    })

                    const cwd = process.cwd()
                    process.chdir(__dirname)

                    await card.load()

                    process.chdir(cwd)

                    let htmlRendered = card.render()
                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'mock-card-snippet-button.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).includes(helpers.stripWhitespaces(htmlExpected)).should.be.true
                })

                it('renders the button in a deactivated state if "package.outputDir" wasn\'t found', async function () {
                    const card = new Card({
                        package: {
                            inputDir: './mock-data/card/card-package/'
                        }
                    })

                    const cwd = process.cwd()
                    process.chdir(__dirname)

                    await card.load()

                    process.chdir(cwd)

                    let htmlRendered = card.render()
                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card', 'mock-card-snippet-button-disabled.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).includes(helpers.stripWhitespaces(htmlExpected)).should.be.true
                })

                it('throws an error if object contains a field "package" and Card.load() wasn\'t called before Card.render() was called', async function () {
                    const card = new Card({
                        package: {
                            inputDir: './mock-data/card/card-package/',
                            outputDir: './temp/card/card-package/'
                        }
                    })

                    expect(function () {
                        card.render()
                    }).to.throw(Error, 'Your json card description contains a link to a package that needs to be loaded before it can be rendered. Please run Card.load() before you run Card.render()!')
                })
            })

            // context('the object passed to the constructor contains a field "link", which contains a path to a file relative to where Card was instantiated', function () {
            //     context('the file contains a valid json object that describes a card', function () {
            //         it('takes the card description from the linked file', async function () {
            //             const card = new Card({
            //                 link: './mock-data/card/linked-card.json'
            //             })

            //             let htmlRendered = card.render()
            //             let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'card-package', 'mock-card-linked-card.html'), 'utf8')

            //             helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
            //         })

            //         // it('prioritizes information in the object itself over information from the linked object', function () {

            //     // })
            //     })
            // })
        })

        // context('invalid data was passed with the constructor', function () {

        // })
    })
})
