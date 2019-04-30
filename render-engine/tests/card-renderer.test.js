'use strict'

const path = require('path')

const chai = require('chai')
chai.should()
const expect = chai.expect

const chaiFiles = require('chai-files')
chai.use(chaiFiles)
const file = chaiFiles.file
const dir = chaiFiles.dir

const fs = require('fs-extra')

const CardRenderer = require('../card-renderer')

describe('card-renderer', function () {
    describe('render() renders a card package into a html website', function () {
        let cardDirectory = path.join(__dirname, 'cards', 'markdown-card')
        let outputDirectory = path.join(__dirname, 'dist', 'markdown-card')

        beforeEach(async function () {
            await fs.emptyDir(path.join(__dirname, 'dist'))
        })

        it('creates all directories and files as expected', async function () {
            // check pre-condition:
            expect(dir(outputDirectory)).to.not.exist

            // run function under test:
            const re = new CardRenderer(cardDirectory, outputDirectory)
            await re.render()

            // check if all directories and files have been created as expected:
            expect(dir(outputDirectory)).to.exist
            expect(file(path.join(outputDirectory, 'index.html'))).to.exist

            expect(dir(path.join(outputDirectory, 'more-ressources'))).to.exist
            expect(file(path.join(outputDirectory, 'more-ressources', 'another-text.html'))).to.exist
            expect(file(path.join(outputDirectory, 'more-ressources', 'image.jpg'))).to.exist
            expect(file(path.join(outputDirectory, 'more-ressources', 'replace-md-examples.html'))).to.exist

            // verify that card.json wasn't copied over:
            expect(file(path.join(outputDirectory, 'card.json')))
        })

        // TODO: this test should be done with re.processFile(), not the whole re.render!
        it('renders .md into .html', async function () {
            // check pre-condition:
            expect(dir(outputDirectory)).to.not.exist

            // run function under test:
            const re = new CardRenderer(cardDirectory, outputDirectory)
            await re.render()

            // compare contents of created files with expected content:
            let htmlRendered = await fs.readFile(path.join(outputDirectory, 'index.html'), 'utf8')
            let htmlExpected = await fs.readFile(path.join(__dirname, 'mocks', 'dist', 'markdown-card', 'index.html'), 'utf8')
            htmlRendered.should.equal(htmlExpected)

            let htmlRendered2 = await fs.readFile(path.join(outputDirectory, 'more-ressources', 'another-text.html'), 'utf8')
            let htmlExpected2 = await fs.readFile(path.join(__dirname, 'mocks', 'dist', 'markdown-card', 'more-ressources', 'another-text.html'), 'utf8')
            htmlRendered2.should.equal(htmlExpected2)
        })

        // TODO: this test should be done with re.processFile(), not the whole re.render!
        it('converts internal links to .md files correctly with links to the rendered .html files', async function () {
            // check pre-condition:
            expect(dir(outputDirectory)).to.not.exist

            // run function under test:
            const re = new CardRenderer(cardDirectory, outputDirectory)
            await re.render()

            // compare contents of created files with expected content:
            let htmlRendered2 = await fs.readFile(path.join(outputDirectory, 'more-ressources', 'replace-md-examples.html'), 'utf8')
            let htmlExpected2 = await fs.readFile(path.join(__dirname, 'mocks', 'dist', 'markdown-card', 'more-ressources', 'replace-md-examples.html'), 'utf8')
            htmlRendered2.should.equal(htmlExpected2)
        })
    })
})
