'use strict'

const chai = require('chai')
chai.should()
const expect = chai.expect

const chaiFiles = require('chai-files')
chai.use(chaiFiles)
const file = chaiFiles.file
const dir = chaiFiles.dir

const fs = require('fs').promises
const path = require('path')

const helpers = require('./helpers')

const Usm = require('../usm')
const Activities = require('../activities')

describe('usm', function () {
    // describe('the constructor Usm(context)', function () {
    // })

    const tempDir = path.join(process.cwd(), 'temp', 'usm.test')

    describe('Usm.prototype.getContext(field)', function () {
        const usmContext = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.getContext', 'input'),
            outputDir: path.join(tempDir, 'output')
        }

        it('returns the whole context object if "field" is not given', function () {
            const usm = new Usm(usmContext)
            usm.getContext().should.equal(usmContext)
        })

        it('returns the value fo the requested field', function () {
            const usm = new Usm(usmContext)
            usm.getContext('inputDir').should.equal(usmContext.inputDir)
        })

        it('throws an ReferenceError if requested field doesn\'t exist', function () {
            const usm = new Usm(usmContext)
            expect(function () {
                usm.getContext('nonExistentField')
            }).to.throw(RangeError, 'ERROR: Field "nonExistentField" doesn\'t exist!')
        })

        // TODO: context object gets enriched with releases, if releases given with map
    })

    describe('Usm.prototype.getUsm()', function () {
        const usmContext = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.getUsm', 'input'),
            outputDir: path.join(tempDir, 'output')
        }

        it('returns the usm object that was loaded from "usm.json" in the "inputDir"', async function () {
            const usm = new Usm(usmContext)

            const usmObjectExpected = JSON.parse(await fs.readFile(path.join(usmContext.inputDir, 'usm.json')))
            usm.getUsm().should.eql(usmObjectExpected)
        })
    })

    describe('Usm.prototype.getActivities()', function () {
        const usmContext = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.getActivities', 'input'),
            outputDir: path.join(tempDir, 'output')
        }

        it('returns the Activities object generated from the json usm object', function () {
            const usm = new Usm(usmContext)
            usm.getActivities().should.be.instanceOf(Activities)
        })
    })

    describe('Usm.prototype.renderCards(config)', function () {
        const usmContext = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.renderCards', 'input'),
            outputDir: path.join(tempDir, 'output')
        }

        beforeEach(async function () {
            await helpers.cleanUpDir(usmContext.outputDir)
        })

        it('renders all files from input directory to the output directory', async function () {
            expect(dir(usmContext.outputDir)).to.be.empty

            const usm = new Usm(usmContext)

            const options = {}
            await usm.renderCards(options)

            expect(dir(path.join(usmContext.outputDir, 'package-1'))).to.exist
            expect(file(path.join(usmContext.outputDir, 'package-1', 'card.json'))).to.not.exist
            expect(file(path.join(usmContext.outputDir, 'package-1', 'index.html'))).to.exist

            expect(dir(path.join(usmContext.outputDir, 'package-2'))).to.exist
            expect(file(path.join(usmContext.outputDir, 'package-2', 'card.json'))).to.not.exist
            expect(file(path.join(usmContext.outputDir, 'package-2', 'entrypoint.html'))).to.exist
            expect(dir(path.join(usmContext.outputDir, 'package-2', 'more-files-to-copy'))).to.exist
            expect(file(path.join(usmContext.outputDir, 'package-2', 'more-files-to-copy', 'another-file.html'))).to.exist
        })
    })

    describe('Usm.prototype.renderMap(config)', function () {
        const inputBaseDir = path.join(__dirname, 'mock-data', 'usm.renderMap')
        const outputDir = path.join(tempDir, 'output')

        context('the given context object is valid', function () {
            beforeEach(async function () {
                await helpers.cleanUpDir(outputDir)
            })

            context('with standard settings for rendering', function () {
                it('can render an empty Usm container', async function () {
                    const usmContext = {
                        inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                        outputDir: outputDir
                    }

                    const usm = new Usm(usmContext)
                    await usm.renderMap()

                    const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })

                it('can render an Usm with empty Activities container', async function () {
                    const usmContext = {
                        inputDir: path.join(inputBaseDir, 'usm-activities-empty', 'input'),
                        outputDir: outputDir
                    }

                    const usm = new Usm(usmContext)
                    await usm.renderMap()

                    const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-activities-empty', 'mocked-output', 'index.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })
            })

            context('with a configuration object for rendering', function () {
                const usmContext = {
                    inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                    outputDir: outputDir
                }

                describe('the field "css"', function () {
                    it('renders a <link rel="stylesheet" /> tag with the value of "css" as the value of "href", if the field "css" contains a string', async function () {
                        const usm = new Usm(usmContext)

                        const config = {
                            css: './path/to/stylesheet.css'
                        }

                        await usm.renderMap(config)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-stylesheet.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    context('field "css" is an array', function () {
                        it('renders a <link rel="stylesheet" /> tag with the value of every string in the array as the value of "href", if the field contains a array of strings', async function () {
                            const usm = new Usm(usmContext)

                            const config = {
                                css: [
                                    './path/to/stylesheet.css',
                                    './path/to/another/stylesheet.css',
                                    './yet_another_stylesheet.css'
                                ]
                            }

                            await usm.renderMap(config)

                            const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                            let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-multiple-stylesheets.html'), 'utf8')
                            htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                            helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                        })

                        it('throws a TypeError, if the array contains a value that is not of type string', async function () {
                            const usm = new Usm(usmContext)

                            const config = {
                                css: [
                                    'a string',
                                    5
                                ]
                            }

                            await usm.renderMap(config).should.be.rejectedWith(TypeError, 'Value of field "css" in configuration object has to be a string or an array of strings! Found element in array that is not a string.')
                        })
                    })

                    it('throws a TypeError, if the field "css" is defined but neither contains a string nor an array', async function () {
                        const usm = new Usm(usmContext)

                        const config = {
                            css: 5
                        }

                        await usm.renderMap(config).should.be.rejectedWith(TypeError, 'Value of field "css" in configuration object has to be a string or an array of strings!')
                    })

                    it('doesn\'t render a <link rel="stylesheet" /> tag if field "css" is not defined', async function () {
                        const usmContext = {
                            inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                            outputDir: outputDir
                        }
                        const usm = new Usm(usmContext)

                        const config = {}

                        await usm.renderMap(config)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })
                })

                describe('the field "js"', function () {
                    it('renders a <script /> tag with the given value of "js" as the value of "src" if the field "js" contains a string', async function () {
                        const usm = new Usm(usmContext)

                        const config = {
                            js: './path/to/script.js'
                        }

                        await usm.renderMap(config)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-script.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    it('throws a TypeError if field "js" is defined but doesn\'t contain a string', async function () {
                        const usm = new Usm(usmContext)

                        const config = {
                            js: 5
                        }

                        await usm.renderMap(config).should.be.rejectedWith(TypeError)
                    })

                    it('doesn\'t render a <script /> tag if field "js" is not defined', async function () {
                        const usm = new Usm(usmContext)

                        await usm.renderMap({})

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })
                })

                describe('the field "timeline"', function () {
                    it('has to be boolean', async function () {
                        const usm = new Usm(usmContext)

                        await usm.renderMap({ timeline: true }).should.be.fulfilled

                        await usm.renderMap({ timeline: 'blah' }).should.be.rejected

                        await usm.renderMap({ timeline: [] }).should.be.rejected
                    })

                    it('doesn\'t render an arrow if value is "false"', async function () {
                        const usm = new Usm(usmContext)

                        const config = {
                            timeline: false
                        }

                        await usm.renderMap(config)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    it('renders an arrow if value is "true"', async function () {
                        const usm = new Usm(usmContext)

                        const config = {
                            timeline: true
                        }

                        await usm.renderMap(config)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm-with-timeline.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    it('defaults to "false" if not given', async function () {
                        const usm = new Usm(usmContext)

                        const config = {
                            timeline: false
                        }

                        await usm.renderMap(config)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })
                })
            })

            it('throws a TypeError if the passed parameter is not an object', async function () {
                const usmContext = {
                    inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                    outputDir: outputDir
                }

                const usm = new Usm(usmContext)

                const config = 3

                await usm.renderMap(config).should.be.rejectedWith(TypeError, 'Configuration object has to be an object!')
            })
        })
    })
})
