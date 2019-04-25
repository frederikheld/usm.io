'use strict'

const chai = require('chai')
const should = chai.should()
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

    describe('Usm.prototype.getContext(field)', function () {
        const context = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.getContext', 'input'),
            outputDir: path.join(__dirname, 'temp', 'output')
        }

        it('returns the whole context object if "field" is not given', function () {
            const usm = new Usm(context)
            usm.getContext().should.equal(context)
        })

        it('returns the value fo the requested field', function () {
            const usm = new Usm(context)
            usm.getContext('inputDir').should.equal(context.inputDir)
        })

        it('throws an ReferenceError if requested field doesn\'t exist', function () {
            const usm = new Usm(context)
            expect(function () {
                usm.getContext('nonExistentField')
            }).to.throw(RangeError, 'ERROR: Field "nonExistentField" doesn\'t exist!')
        })
    })

    describe('Usm.prototype.getUsm()', function () {
        const context = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.getUsm', 'input'),
            outputDir: path.join(__dirname, 'temp', 'output')
        }

        it('returns the usm object that was loaded from "usm.json" in the "inputDir"', function () {
            const usmObjectExpected = {
                'activities': []
            }

            const usm = new Usm(context)
            usm.getUsm().should.eql(usmObjectExpected)
        })
    })

    describe('Usm.prototype.getActivities()', function () {
        const context = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.getActivities', 'input'),
            outputDir: path.join(__dirname, 'temp', 'output')
        }

        it('returns the Activities object generated from the json usm object', function () {
            const usm = new Usm(context)
            usm.getActivities().should.be.instanceOf(Activities)
        })
    })

    describe('Usm.prototype.renderCards(config)', function () {
        const context = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.renderCards', 'input'),
            outputDir: path.join(__dirname, 'temp', 'output')
        }

        beforeEach(async function () {
            await helpers.cleanUpDir(context.outputDir)
        })

        it('renders all files from input directory to the output directory', async function () {
            expect(dir(context.outputDir)).to.be.empty

            const usm = new Usm(context)

            let options = {}
            await usm.renderCards(options)

            expect(dir(path.join(context.outputDir, 'package-1'))).to.exist
            expect(file(path.join(context.outputDir, 'package-1', 'card.json'))).to.not.exist
            expect(file(path.join(context.outputDir, 'package-1', 'index.html'))).to.exist

            expect(dir(path.join(context.outputDir, 'package-2'))).to.exist
            expect(file(path.join(context.outputDir, 'package-2', 'card.json'))).to.not.exist
            expect(file(path.join(context.outputDir, 'package-2', 'entrypoint.html'))).to.exist
            expect(dir(path.join(context.outputDir, 'package-2', 'more-files-to-copy'))).to.exist
            expect(file(path.join(context.outputDir, 'package-2', 'more-files-to-copy', 'another-file.html'))).to.exist
        })
    })

    describe('Usm.prototype.renderMap(config)', function () {
        const inputBaseDir = path.join(__dirname, 'mock-data', 'usm.renderMap')
        const outputDir = path.join(__dirname, 'temp', 'output')

        context('the given context object is valid', function () {
            beforeEach(async function () {
                await helpers.cleanUpDir(outputDir)
            })

            context('with standard settings for rendering', function () {
                it('can render an empty Usm container', async function () {
                    const context = {
                        inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                        outputDir: outputDir
                    }

                    const usm = new Usm(context)
                    await usm.renderMap()

                    let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })

                it('can render an Usm with empty Activities container', async function () {
                    const context = {
                        inputDir: path.join(inputBaseDir, 'usm-activities-empty', 'input'),
                        outputDir: outputDir
                    }

                    const usm = new Usm(context)
                    await usm.renderMap()

                    let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-activities-empty', 'mocked-output', 'index.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })
            })

            context('with a configuration object for rendering', function () {
                const context = {
                    inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                    outputDir: outputDir
                }

                describe('the field "css"', function () {
                    it('renders a <link rel="stylesheet" /> tag with the calue of "css" as the value of "href", if the field "css" contains a string', async function () {
                        const usm = new Usm(context)

                        let config = {
                            css: './path/to/stylesheet.css'
                        }

                        await usm.renderMap(config)

                        let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-stylesheet.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    it('throws a TypeError,if the field "css" is defined but doesn\'t contain a string', async function () {
                        const context = {
                            inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                            outputDir: outputDir
                        }

                        const usm = new Usm(context)

                        let config = {
                            css: 5
                        }

                        await usm.renderMap(config).should.be.rejectedWith(TypeError, 'Value of field "css" in configuration object has to be a string!')
                    })

                    it('doesn\'t render a <link rel="stylesheet" /> tag if field "css" is not defined', async function () {
                        const context = {
                            inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                            outputDir: outputDir
                        }
                        const usm = new Usm(context)

                        let config = {}

                        await usm.renderMap(config)

                        let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })
                })

                describe('the field "js"', function () {
                    it('renders a <script /> tag with the given value of "js" as the value of "src" if the field "js" contains a string', async function () {
                        const usm = new Usm(context)

                        let config = {
                            js: './path/to/script.js'
                        }

                        await usm.renderMap(config)

                        let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-script.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    it('throws a TypeError if field "js" is defined but doesn\'t contain a string', async function () {
                        const usm = new Usm(context)

                        let config = {
                            js: 5
                        }

                        await usm.renderMap(config).should.be.rejectedWith(TypeError)
                    })

                    it('doesn\'t render a <script /> tag if field "js" is not defined', async function () {
                        const usm = new Usm(context)

                        await usm.renderMap({})

                        let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })
                })

                describe('the field "timeline"', function () {
                    it('has to be boolean', async function () {
                        const usm = new Usm(context)

                        await usm.renderMap({ 'timeline': true }).should.be.fulfilled

                        await usm.renderMap({ 'timeline': 'blah' }).should.be.rejected

                        await usm.renderMap({ 'timeline': [] }).should.be.rejected
                    })

                    it('doesn\'t render an arrow if value is "false"', async function () {
                        const usm = new Usm(context)

                        const config = {
                            timeline: false
                        }

                        await usm.renderMap(config)

                        let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    it('renders an arrow if value is "true"', async function () {
                        const usm = new Usm(context)

                        const config = {
                            timeline: true
                        }

                        await usm.renderMap(config)

                        let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm-with-timeline.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    it('defaults to "false" if not given', async function () {
                        const usm = new Usm(context)

                        const config = {
                            timeline: false
                        }

                        await usm.renderMap(config)

                        let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')

                        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                        htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })
                })
            })

            it('throws a TypeError if the passed parameter is not an object', async function () {
                const usm = new Usm(context)

                let config = 3

                await usm.renderMap(config).should.be.rejectedWith(TypeError, 'Configuration object has to be an object!')
            })
        })
    })
})
