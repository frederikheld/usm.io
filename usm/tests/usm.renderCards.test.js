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

describe('usm.renderCards', function () {
    const tempDir = path.join(process.cwd(), 'temp', 'usm.test')
    const inputBaseDir = path.join(__dirname, 'mock-data', 'usm.renderCards')
    const outputDir = path.join(tempDir, 'output-renderCards')

    describe('Usm.prototype.renderCards(config)', function () {
        beforeEach(async function () {
            await helpers.cleanUpDir(outputDir)
        })

        context('with standard settings for rendering', function () {
            const usmContext = {
                inputDir: path.join(inputBaseDir, 'input-1'),
                outputDir: outputDir
            }

            it('renders all files from input directory to the output directory', async function () {
                expect(dir(usmContext.outputDir)).to.be.empty

                const usm = new Usm(usmContext)

                const config = {}
                await usm.renderCards(config)

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

        context('with a configuration object for rendering', function () {
            const usmContext = {
                inputDir: path.join(inputBaseDir, 'input-2'),
                outputDir: outputDir
            }
            describe('the field "css"', function () {
                context('field "css" is a string', function () {
                    it('renders a <link rel="stylesheet" /> tag with the value of "css" as the value of "href"', async function () {
                        const usm = new Usm(usmContext)

                        const config = {
                            css: './path/to/stylesheet.css'
                        }

                        await usm.renderCards(config)

                        const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'package-1', 'index.html'), 'utf-8')

                        const htmlExpectedSnippet = '<link rel="stylesheet" href="' + config.css + '">'

                        htmlRendered.should.include(htmlExpectedSnippet)
                    })
                })

                //         // context('field "css" is an array', function () {
                //         //     it('renders a <link rel="stylesheet" /> tag with the value of every string in the array as the value of "href", if the field contains a array of strings', async function () {
                //         //         const usm = new Usm(usmContext)

                //         //         const config = {
                //         //             css: [
                //         //                 './path/to/stylesheet.css',
                //         //                 './path/to/another/stylesheet.css',
                //         //                 './yet_another_stylesheet.css'
                //         //             ]
                //         //         }

                //         //         await usm.renderMap(config)

                //         //         const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                //         //         let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-multiple-stylesheets.html'), 'utf8')
                //         //         htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                //         //         htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                //         //         helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                //         //     })

                //         //     it('throws a TypeError, if the array contains a value that is not of type string', async function () {
                //         //         const usm = new Usm(usmContext)

                //         //         const config = {
                //         //             css: [
                //         //                 'a string',
                //         //                 5
                //         //             ]
                //         //         }

                //         //         await usm.renderMap(config).should.be.rejectedWith(TypeError, 'Value of field "css" in configuration object has to be a string or an array of strings! Found element in array that is not a string.')
                //         //     })
                //         // })

                //         // it('throws a TypeError, if the field "css" is defined but neither contains a string nor an array', async function () {
                //         //     const usm = new Usm(usmContext)

                //         //     const config = {
                //         //         css: 5
                //         //     }

                //         //     await usm.renderMap(config).should.be.rejectedWith(TypeError, 'Value of field "css" in configuration object has to be a string or an array of strings!')
                //         // })

                //         // it('doesn\'t render a <link rel="stylesheet" /> tag if field "css" is not defined', async function () {
                //         //     const usmContext = {
                //         //         inputDir: path.join(inputBaseDir, 'usm-empty', 'input'),
                //         //         outputDir: outputDir
                //         //     }
                //         //     const usm = new Usm(usmContext)

                //         //     const config = {}

                //         //     await usm.renderMap(config)

                //         //     const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')

                //         //     let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                //         //     htmlExpected += await fs.readFile(path.join(inputBaseDir, 'usm-empty', 'mocked-output', 'usm.html'), 'utf8')
                //         //     htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                //     //     helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                //     // })
            })
        })
    })
})
