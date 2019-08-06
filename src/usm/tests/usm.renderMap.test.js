'use strict'

const chai = require('chai')
chai.should()

const chaiFiles = require('chai-files')
chai.use(chaiFiles)

const fs = require('fs').promises
const fsExtra = require('fs-extra')
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
                await fsExtra.emptyDir(outputDir)
            })

            describe('default settings for rendering', function () {
                it('can render an empty Usm container', async function () {
                    const usmContext = {
                        inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                        outputDir: outputDir
                    }

                    const usm = new Usm(usmContext)
                    await usm.renderMap()

                    const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')
                    const htmlExpected = await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')

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
                    const htmlExpected = await fs.readFile(path.join(inputBaseDir, 'usm-activities-empty', 'mocked-output', 'index.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })
            })

            context('with a "renderOptions" object for rendering', function () {
                const usmContext = {
                    inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                    outputDir: outputDir
                }

                it('throws a TypeError if "renderOptions" is not an object', async function () {
                    const usm = new Usm(usmContext)

                    const renderOptions = 3

                    await usm.renderMap(renderOptions).should.be.rejectedWith(TypeError, '"renderOptions" has to be an object!')
                })

                describe('the field "timeline"', function () {
                    it('has to be boolean', async function () {
                        const usm = new Usm(usmContext)

                        await usm.renderMap({ timeline: true }).should.be.fulfilled
                        await usm.renderMap({ timeline: 'blah' }).should.be.rejected
                        await usm.renderMap({ timeline: [] }).should.be.rejectedWith('"renderOptions.timeline" has to be of type boolean!')
                    })

                    it('doesn\'t render an arrow if value is "false"', async function () {
                        const usm = new Usm(usmContext)

                        const renderOptions = {
                            timeline: false
                        }

                        await usm.renderMap(renderOptions)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')
                        const htmlExpected = await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    it('renders an arrow if value is "true"', async function () {
                        const usm = new Usm(usmContext)

                        const renderOptiosn = {
                            timeline: true
                        }

                        await usm.renderMap(renderOptiosn)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')
                        const htmlExpected = await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm-with-timeline.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })

                    it('defaults to "false" if not given', async function () {
                        const usm = new Usm(usmContext)

                        const renderOptions = {
                            timeline: false
                        }

                        await usm.renderMap(renderOptions)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')
                        const htmlExpected = await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')

                        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                    })
                })
            })

            context('with field "releases" in usm', () => {
                const usmContext = {
                    inputDir: path.join(inputBaseDir, 'usm-with-releases', 'input'),
                    outputDir: outputDir
                }
                it('dynamically renders CSS for releases and makes it available via mustache tag "{{& releases-css }}" in header', async () => {
                    const usm = new Usm(usmContext)

                    const renderOptions = {
                        header: {
                            template: path.join(inputBaseDir, 'usm-with-releases', 'input', 'header.html')
                        }
                    }

                    await usm.renderMap(renderOptions)

                    const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                    htmlRendered.should.contain('<style type="text/css">')
                    htmlRendered.should.contain('.release-a')
                    htmlRendered.should.contain('content: "Release A";')
                    htmlRendered.should.contain('.release-b')
                    htmlRendered.should.contain('content: "Release B";')
                    htmlRendered.should.contain('</style>')
                })
            })
        })
    })
})
