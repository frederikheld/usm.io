'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const chaiFiles = require('chai-files')
chai.use(chaiFiles)
const file = chaiFiles.file
const dir = chaiFiles.dir

const fs = require('fs').promises
const fsSync = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')

const helpers = require('./helpers')

const Usm = require('../usm')

describe('usm', function () {
    describe('the constructor Usm(jsonUsm)', function () {
        describe('parameter "jsonObject"', function () {
            it('expects a JSON object', function () {
                expect(function () {
                    new Usm({})
                }).to.not.throw()
            })

            it('throws an error if the passed data is not a json object', function () {
                expect(function () {
                    new Usm('This is not an object')
                }).to.throw(TypeError)
                expect(function () {
                    new Usm([])
                }).to.throw(TypeError)
            })

            it('throws an error if no data is passed at all', function () {
                expect(function () {
                    new Usm()
                }).to.throw(ReferenceError)
            })
        })

        describe('the parameter "inputDir"', function () {
            it('accepts a string that is a valid absolute path to a directory', function () {
                let inputDir = path.join(__dirname, 'mock-data', 'input', 'existing-folder')
                const usm = new Usm({}, inputDir)
                usm.getInputDir().should.equal(inputDir)
            })

            it('throws an error if the string isn\'t a valid path to a directory', function () {
                let inputDir = path.join(__dirname, 'mock-data', 'input', 'non-existing-folder')
                expect(function () {
                    new Usm({}, inputDir)
                }).to.throw(RangeError)

                let inputDir2 = path.join(__dirname, 'mock-data', 'input', 'existing-file.txt')
                expect(function () {
                    new Usm({}, inputDir2)
                }).to.throw(RangeError)
            })

            it('defaults to "./input" relative to where Usm() is called, if no value is given', function () {
                const usm = new Usm({})
                usm.getInputDir().should.equal(path.join(__dirname, '..', 'input'))
            })
        })

        describe('the parameter "outputDir"', function () {
            it('accepts a string that is a valid absolute path to a directory', function () {
                let outputDir = path.join(__dirname, 'mock-data', 'output', 'existing-folder')
                const usm = new Usm({}, outputDir)
                usm.getInputDir().should.equal(outputDir)
            })

            it('throws an error if the string isn\'t a valid path to a directory', function () {
                let outputDir = path.join(__dirname, 'mock-data', 'output', 'non-existing-folder')
                expect(function () {
                    new Usm({}, outputDir)
                }).to.throw(RangeError)

                let outputDir2 = path.join(__dirname, 'mock-data', 'output', 'existing-file.txt')
                expect(function () {
                    new Usm({}, outputDir2)
                }).to.throw(RangeError)
            })

            it('defaults to "./output" relative to where Usm() is called, if no value is given', function () {
                const usm = new Usm({})
                usm.getOutputDir().should.equal(path.join(__dirname, '..', 'output'))
            })
        })
    })

    describe('Usm.prototype.renderPackages(config)', function () {
        let outputPath = path.join(__dirname, 'temp', 'output')

        beforeEach(async function () {
            try {
                let stat = await fs.stat(outputPath)
                if (stat.isDirectory()) {
                    await fsExtra.remove(outputPath)
                } else {
                    throw new Error('"' + outputPath + '" exists and is not a directory!')
                }
            } catch (err) {
                if (err.code === 'ENOENT') {
                    // directory doesn't exist yet. That's okay, we will create it some lines below.
                } else {
                    throw err
                }
            }
            await fsExtra.mkdirp(outputPath)
        })

        it('copies all files from input directory to the output directory (for now, later it will convert everything that isn\'t html into html', async function () {
            expect(dir(outputPath)).to.be.empty

            let inputPath = path.join(__dirname, 'mock-data', 'usm.renderPackages')
            const usm = new Usm({}, inputPath, outputPath)

            let options = {}
            await usm.renderPackages(options)

            expect(dir(path.join(outputPath, 'package-1'))).to.exist
            expect(file(path.join(outputPath, 'package-1', 'card.json'))).to.exist
            expect(file(path.join(outputPath, 'package-1', 'index.html'))).to.exist

            expect(dir(path.join(outputPath, 'package-2'))).to.exist
            expect(file(path.join(outputPath, 'package-2', 'card.json'))).to.exist
            expect(file(path.join(outputPath, 'package-2', 'entrypoint.html'))).to.exist
            expect(dir(path.join(outputPath, 'package-2', 'more-files-to-copy'))).to.exist
            expect(file(path.join(outputPath, 'package-2', 'more-files-to-copy', 'another-file.html'))).to.exist
        })
    })

    describe('Usm.prototype.renderMap(config)', function () {
        // context('stored json object is invalid', function () {

        // })

        context('the stored json object is valid', function () {
            context('with standard settings for rendering', function () {
                it('renders an empty Usm container', async function () {
                    const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                    const jsonUsm = JSON.parse(rawUsm)

                    const usm = new Usm(jsonUsm)

                    let htmlRendered = usm.renderMap()

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })
            })
        })

        it('renders an empty Activities container', async function () {
            const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-activities-empty.json'))
            const jsonUsm = JSON.parse(rawUsm)

            const usm = new Usm(jsonUsm)

            let htmlRendered = usm.renderMap()

            let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-activities-empty.html'), 'utf8')
            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

            helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
        })

        it('can take a configuration object as optional parameter', function () {
            context('the passed parameter is an object', function () {
                describe('the configuration object', function () {
                    describe('field "css"', function () {
                        context('field "css" is given and contains a string', function () {
                            it('renders a <link rel="stylesheet" /> tag with the given string as the value of "href"', async function () {
                                const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                                const jsonUsm = JSON.parse(rawUsm)

                                const usm = new Usm(jsonUsm)
                                let config = {
                                    css: './path/to/stylesheet.css'
                                }
                                let htmlRendered = usm.renderMap(config)

                                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-stylesheet.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                            })
                        })

                        context('field "css" is defined but doesn\'t contain a string', function () {
                            it('throws a TypeError', async function () {
                                const usm = new Usm({})

                                let config = {
                                    css: 5
                                }

                                expect(function () {
                                    usm.renderMap(config)
                                }).to.throw(TypeError)
                            })
                        })

                        context('field "css" is not defined', function () {
                            it('doesn\'t render a <link rel="stylesheet" /> tag', async function () {
                                const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                                const jsonUsm = JSON.parse(rawUsm)
                                const usm = new Usm(jsonUsm)

                                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                                let htmlRendered = usm.renderMap({})

                                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                            })
                        })
                    })

                    describe('field "js"', function () {
                        context('field "js" is given and contains a string', function () {
                            it('renders a <script /> tag with the given string as the value of "src"', async function () {
                                const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                                const jsonUsm = JSON.parse(rawUsm)

                                const usm = new Usm(jsonUsm)
                                let config = {
                                    js: './path/to/script.js'
                                }
                                let htmlRendered = usm.renderMap(config)

                                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-script.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                            })
                        })

                        context('field "js" is defined but doesn\'t contain a string', function () {
                            it('throws a TypeError', async function () {
                                const usm = new Usm({})

                                let config = {
                                    js: 5
                                }

                                expect(function () {
                                    usm.renderMap(config)
                                }).to.throw(TypeError)
                            })
                        })

                        context('field "js" is not defined', function () {
                            it('doesn\'t render a <script /> tag', async function () {
                                const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                                const jsonUsm = JSON.parse(rawUsm)
                                const usm = new Usm(jsonUsm)

                                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                                let htmlRendered = usm.renderMap({})

                                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                            })
                        })
                    })

                    describe('the field "timeline"', function () {
                        it('has to be boolean', function () {
                            const usm = new Usm({})

                            expect(function () {
                                usm.renderMap({ 'timeline': true })
                            }).to.not.throw()

                            expect(function () {
                                usm.renderMap({ 'timeline': 'blah' })
                            }).to.throw()

                            expect(function () {
                                usm.renderMap({ 'timeline': [] })
                            }).to.throw()
                        })

                        it('doesn\'t render an arrow if value is "false"', async function () {
                            const usm = new Usm({})

                            const config = {
                                timeline: false
                            }

                            let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'))

                            let htmlRendered = usm.renderMap(config)

                            helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                        })

                        it('renders an arrow if value is "true"', async function () {
                            const usm = new Usm({})

                            const config = {
                                timeline: true
                            }

                            let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-with-timeline.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'))

                            let htmlRendered = usm.renderMap(config)

                            helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                        })

                        it('defaults to "false" if not given', async function () {
                            const usm = new Usm({})

                            let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'))

                            let htmlRendered = usm.renderMap()

                            helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                        })
                    })
                })
            })

            context('the passed parameter is not an object', function () {
                it('throws a TypeError', function () {
                    const usm = new Usm({})

                    let config = 3

                    expect(function () {
                        usm.renderMap(config)
                    }).to.throw(TypeError)
                })
            })
        })
    })
})
