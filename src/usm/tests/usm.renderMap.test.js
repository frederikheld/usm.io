'use strict'

const chai = require('chai')
chai.should()

const chaiFiles = require('chai-files')
chai.use(chaiFiles)

const fs = require('fs').promises
const path = require('path')

const helpers = require('./helpers')

const Usm = require('../usm')

describe('usm.renderMap', function () {
    const tempDir = path.join(process.cwd(), 'temp', 'usm.test')

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
                    context('field "css" is a string', function () {
                        it('renders a <link rel="stylesheet" /> tag with the value of "css" as the value of "href"', async function () {
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
