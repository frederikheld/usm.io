'use strict'

const fs = require('fs').promises
const fsExtra = require('fs-extra')

const chai = require('chai')
chai.should()
const expect = chai.expect

const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const chaiFiles = require('chai-files')
chai.use(chaiFiles)
const file = chaiFiles.file
const dir = chaiFiles.dir

const path = require('path')

const CardRenderer = require('../card-renderer')

describe('card-renderer', function () {
    const mocksBaseDir = path.join(__dirname, 'mock-data', 'card-renderer.test')
    const mockForMandatoryInputPath = path.join(mocksBaseDir, 'general', 'mock-for-mandatory-input-path-to-make-tests-pass.md')

    const tempDir = path.join(process.cwd(), 'temp')
    const mockForMandatoryOutputPath = path.join(tempDir, 'general', 'mock-for-mandatory-output-path-to-make-tests-pass.html')

    before(async function () {
        await fsExtra.remove(tempDir)
        await fsExtra.mkdirp(tempDir)
        await fsExtra.mkdirp(path.dirname(mockForMandatoryOutputPath))
    })

    after(async function () {
        // await fsExtra.remove(outputDirectory)
        // removes the outputDirectory with all of its contents
        // as opposed to rmdir which can only delete an empty directory
    })

    describe('debug', function () {
        // describe('the output directory', function () {
        //     it('create dummy files to see if they get removed with fsExtra.rmdir', async function () {
        //         await fs.writeFile(path.join(outputDirectory, 'hello.txt'), 'Hello World!')
        //     })
        // })
        // describe('this test suite', function () {
        //     // To check if the outputDirectory is created and removed as expected:
        //     it('takes at least 5 seconds to complete', function (done) {
        //         setTimeout(() => { done() }, 1000)
        //     })
        // })
    })

    describe('The constructor CardRenderer', function () {
        it('takes an "options" object as parameter', function () {
            const options = {}

            expect(() => { new CardRenderer(options) }).to.not.throw()
        })

        it('"options" is optional', function () {
            expect(() => { new CardRenderer() }).to.not.throw()
        })

        it('throws an error if something other than an object is passed as "options"', function () {
            const options = 'foo'

            expect(() => { new CardRenderer(options) }).to.throw(TypeError, 'Render configuration has to be an object!')
        })
    })

    describe('async function renderFile', function () {
        const outputDirectoryD = path.join(tempDir, 'render-file')
        describe('the first parameter "inputPath"', function () {
            it('takes the parameter "inputPath"', async function () {
                const cr = new CardRenderer()

                const inputPath = mockForMandatoryInputPath
                const outputPath = mockForMandatoryOutputPath

                await expect(cr.renderFile(inputPath, outputPath)).to.not.be.rejected
            })

            it('rejects with an ReferenceError if "inputPath" is missing', async function () {
                const cr = new CardRenderer()

                const inputPath = undefined
                const outputPath = mockForMandatoryOutputPath

                await expect(cr.renderFile(inputPath, outputPath)).to.be.rejectedWith(ReferenceError, 'Mandatory parameter "inputPath" missing!')
            })

            it('throws an Error if the file at "inputPath" can\'t be read', async function () {
                const cr = new CardRenderer()

                const inputPath = path.join(__dirname, 'mock-data', 'card-renderer.test', 'general', 'non-existent-file.md')
                const outputPath = mockForMandatoryOutputPath

                await expect(cr.renderFile(inputPath, outputPath)).to.be.rejectedWith(ReferenceError, 'Can\'t read from "inputPath"!')
            })
        })

        describe('the second parameter "outputPath"', function () {
            it('takes the parameter "outputPath"', async function () {
                const cr = new CardRenderer()

                const inputPath = mockForMandatoryInputPath
                const outputPath = mockForMandatoryOutputPath

                await expect(cr.renderFile(inputPath, outputPath)).to.not.be.rejected
            })

            it('rejects with an ReferenceError if "outputPath" is missing', async function () {
                const cr = new CardRenderer()

                const inputPath = mockForMandatoryInputPath
                const outputPath = undefined

                await expect(cr.renderFile(inputPath, outputPath)).to.be.rejectedWith(ReferenceError, 'Mandatory parameter "outputPath" missing!')
            })
        })

        it('reads the file from "inputPath" and writes the rendered result to "outputPath"', async function () {
            const outputDirectoryDI = path.join(outputDirectoryD, 'render')
            const inputPath = path.join(mocksBaseDir, 'render-file', 'example.md')

            const outputPath = path.join(outputDirectoryDI, 'example.md')

            const cr = new CardRenderer()
            await cr.renderFile(inputPath, outputPath)

            // expect(dir(outputDirectoryDI)).to.exist

            // const output = await fs.readFile(outputPath, { encoding: 'utf-8' })
        })

        it('rejects with an Error if file could not be written to "outputPath"', async function () {
            const cr = new CardRenderer()

            const inputPath = mockForMandatoryInputPath

            // empty path
            const outputPath = ''
            await expect(cr.renderFile(inputPath, outputPath)).to.be.rejectedWith(Error, 'Can\'t write to "outputPath"!')

            // non-existing sub-directory:
            const outputPath2 = path.join(tempDir, 'non', 'existent', 'directory', 'file.html')
            // await expect(cr.renderFile(inputPath, outputPath2)).to.be.rejectedWith(Error, 'Can\'t write to "outputPath"!')
        })
    })
})
