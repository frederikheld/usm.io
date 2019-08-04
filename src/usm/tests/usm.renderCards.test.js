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
                inputDir: path.join(__dirname, 'mock-data', 'usm.renderCards', 'input-1'),
                outputDir: outputDir
            }

            it('renders all files from the input directory to the output directory', async function () {
                expect(dir(usmContext.outputDir)).to.be.empty

                const usm = new Usm(usmContext)

                await usm.renderCards({})

                expect(dir(path.join(usmContext.outputDir, 'cards', 'package-1'))).to.exist
                expect(file(path.join(usmContext.outputDir, 'cards', 'package-1', 'card.json'))).to.exist
                expect(file(path.join(usmContext.outputDir, 'cards', 'package-1', 'index.html'))).to.exist

                expect(dir(path.join(usmContext.outputDir, 'cards', 'package-2'))).to.exist
                expect(file(path.join(usmContext.outputDir, 'cards', 'package-2', 'card.json'))).to.exist
                expect(file(path.join(usmContext.outputDir, 'cards', 'package-2', 'index.html'))).to.exist
                expect(dir(path.join(usmContext.outputDir, 'cards', 'package-2', 'more-files-to-copy'))).to.exist
                expect(file(path.join(usmContext.outputDir, 'cards', 'package-2', 'more-files-to-copy', 'another-file.html'))).to.exist
            })

            it('converts markdown into html', async function () {
                expect(dir(usmContext.outputDir)).to.be.empty

                const usm = new Usm(usmContext)

                await usm.renderCards({})

                const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'cards', 'package-2', 'index.html'), 'utf-8')

                htmlRendered.should.include('<h1>This is a heading 1</h1>')
                htmlRendered.should.include('<h2>This is a heading 2</h2>')
                htmlRendered.should.include('<p>This is a paragraph</p>')

                helpers.stripWhitespaces(htmlRendered).should.include('<ul><li>List item 1</li><li>List item 2</li></ul>')
            })

            it('keeps html as is', async function () {
                expect(dir(usmContext.outputDir)).to.be.empty

                const usm = new Usm(usmContext)

                await usm.renderCards({})

                const htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'cards', 'package-1', 'index.html'), 'utf-8')

                htmlRendered.should.include('<h1>This is a heading 1</h1>')
                htmlRendered.should.include('<h2>This is a heading 2</h2>')
                htmlRendered.should.include('<p>This is a paragraph</p>')

                helpers.stripWhitespaces(htmlRendered).should.include('<ul><li>List item 1</li><li>List item 2</li></ul>')
            })
        })

        context('with a "renderOptions" object for rendering', function () {
            const usmContext = {
                inputDir: path.join(inputBaseDir, 'input-2'),
                outputDir: outputDir
            }

            it('throws a TypeError if "renderOptions" is not an object', async function () {
                const usm = new Usm(usmContext)

                const renderOptions = 3

                await usm.renderCards(renderOptions).should.be.rejectedWith(TypeError, '"renderOptions" has to be an object!')
            })
        })
    })
})
