'use strict'

const chai = require('chai')
chai.should()

const chaiFiles = require('chai-files')
chai.use(chaiFiles)
const file = chaiFiles.file
const dir = chaiFiles.dir

const path = require('path')
const fsExtra = require('fs-extra')

const RenderEngine = require('../index.js')

describe('RenderEngine', () => {
    const inputDir = path.join(__dirname, 'mock-data')
    const outputDir = path.join(process.cwd(), 'temp', 'render-engine.test')

    describe('render', () => {
        before(async () => {
            await fsExtra.emptyDir(outputDir)
        })

        after(async () => {
            await fsExtra.remove(outputDir)
        })

        it('throws an ReferenceError if the given "inputDir" doesn\'t exist', async () => {
            const testInputDir = path.join(inputDir, 'non-existent-directory')
            const testOutputDir = path.join(outputDir, 'non-existent-directory')

            dir(testInputDir).should.not.exist

            const re = new RenderEngine({})

            await re.renderAllCards(testInputDir, testOutputDir).should.be.rejectedWith(ReferenceError, '"inputDir" "' + testInputDir + '" does not exist!')
        })

        it('throws an ReferenceError if the given "outputDir" doesn\'t exist', async () => {
            const testInputDir = path.join(inputDir, 'empty-directory')
            const testOutputDir = path.join(outputDir, 'non-existent-directory')

            dir(testOutputDir).should.not.exist

            const re = new RenderEngine({})

            await re.renderAllCards(testInputDir, testOutputDir).should.be.rejectedWith(ReferenceError, '"outputDir" "' + testOutputDir + '" does not exist!')
        })

        it('recursively creates all non-empty directories in "outputDir" as they are in "inputDir"', async () => {
            const testInputDir = path.join(inputDir, 'directory-tree')
            const testOutputDir = path.join(outputDir, 'directory-tree')
            await fsExtra.ensureDir(testOutputDir)
            dir(testOutputDir).should.be.empty

            const re = new RenderEngine({})
            await re.renderAllCards(testInputDir, testOutputDir)

            dir(path.join(testOutputDir, 'dir-1')).should.exist
            dir(path.join(testOutputDir, 'dir-2')).should.exist
            dir(path.join(testOutputDir, 'dir-2', 'subdir-1')).should.exist
        })

        it('renders all markdown files from "inputDir" to html files in the respective sub-directories of "outputDir"', async () => {
            const testInputDir = path.join(inputDir, 'markdown-files')
            const testOutputDir = path.join(outputDir, 'markdown-files')
            await fsExtra.ensureDir(testOutputDir)
            dir(testOutputDir).should.be.empty

            const re = new RenderEngine({})
            await re.renderAllCards(testInputDir, testOutputDir)

            file(path.join(testOutputDir, 'file-0.html')).should.exist
            file(path.join(testOutputDir, 'dir-1', 'file-1.html')).should.exist
            file(path.join(testOutputDir, 'dir-2', 'file-2.html')).should.exist
            file(path.join(testOutputDir, 'dir-2', 'subdir-1', 'file-3.html')).should.exist
        })

        it('renders all html files from "inputDir" to html files in the respective sub-directory of "outputDir', async () => {
            const testInputDir = path.join(inputDir, 'html-files')
            const testOutputDir = path.join(outputDir, 'html-files')
            await fsExtra.ensureDir(testOutputDir)
            dir(testOutputDir).should.be.empty

            const re = new RenderEngine({})
            await re.renderAllCards(testInputDir, testOutputDir)

            file(path.join(testOutputDir, 'file-0.html')).should.exist
            file(path.join(testOutputDir, 'dir-1', 'file-1.html')).should.exist
            file(path.join(testOutputDir, 'dir-2', 'file-2.html')).should.exist
            file(path.join(testOutputDir, 'dir-2', 'subdir-1', 'file-3.html')).should.exist
        })

        it('copy and pastes all other files from "inputDir" to the respective sub-directory of "outputDir', async () => {
            const testInputDir = path.join(inputDir, 'non-rendered-files')
            const testOutputDir = path.join(outputDir, 'non-rendered-files')
            await fsExtra.ensureDir(testOutputDir)
            dir(testOutputDir).should.be.empty

            const re = new RenderEngine({})
            await re.renderAllCards(testInputDir, testOutputDir)

            file(path.join(testOutputDir, 'dummy-picture.jpg')).should.exist
            file(path.join(testOutputDir, 'dir-1', 'dummy-picture.gif')).should.exist
            file(path.join(testOutputDir, 'dir-2', 'subdir-1', 'dummy-picture.png')).should.exist
        })
    })
})
