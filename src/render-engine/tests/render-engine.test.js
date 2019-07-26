'use strict'

const chai = require('chai')
chai.should()
const expect = chai.expect

const chaiFiles = require('chai-files')
chai.use(chaiFiles)
const file = chaiFiles.file
const dir = chaiFiles.dir

const path = require('path')
const fsExtra = require('fs-extra')

const RenderEngine = require('../index.js')

describe('RenderEngine', () => {
    const inputDirSuite = path.join(__dirname, 'mock-data')
    const outputDirSuite = path.join(process.cwd(), 'temp', 'render-engine.test')

    before(async () => {
        await fsExtra.emptyDir(outputDirSuite)
        // empties directory without deleting it
        // creates directory recursively if non-existent
    })

    describe('render', () => {
        const outputDir = path.join(outputDirSuite, 'render')
        const inputDir = path.join(inputDirSuite, 'render')
        it('renders all files from "inputDir" to "outputDir"', async () => {
            // check pre-condition:
            expect(dir(outputDir)).to.be.empty

            const renderOptions = {}

            // run function under test:
            const re = new RenderEngine(renderOptions)
            await re.render(inputDir, outputDir)

            // check if all card directories are created in output directory:
            expect(dir(path.join(outputDir, 'markdown-card'))).to.exist
            expect(dir(path.join(outputDir, 'html-card'))).to.exist

            // check for some files if they were created:
            // expect(
            //     file(path.join(outputDir, 'markdown-card', 'index.html'))
            // ).to.exist
            // expect(
            //     file(path.join(outputDir, 'another-card', 'index.html'))
            // ).to.exist
        })
    })
})
