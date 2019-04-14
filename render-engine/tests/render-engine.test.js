'use strict'

// const helpers = require('./helpers')

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const chaiFiles = require('chai-files')
chai.use(chaiFiles)
const file = chaiFiles.file
const dir = chaiFiles.dir

const fs = require('fs-extra')

const RenderEngine = require('../render-engine')

describe('render-engine', function () {
    beforeEach(async function () {
        await fs.emptyDir(path.join(__dirname, 'dist'))
    })
    describe('renderAllCards()', function () {
        it('renders all card packages into html websites', async function () {
            let cardsDirectory = path.join(__dirname, 'cards')
            let outputDirectory = path.join(__dirname, 'dist')

            // check pre-condition:
            expect(dir(outputDirectory)).to.be.empty

            // run function under test:
            const re = new RenderEngine(cardsDirectory, outputDirectory)
            await re.renderAllCards()

            // check if all card directories are created in output directory:
            expect(dir(path.join(outputDirectory, 'markdown-card'))).to.exist
            expect(dir(path.join(outputDirectory, 'another-card'))).to.exist

            // check for some files if they were created:
            expect(file(path.join(outputDirectory, 'markdown-card', 'index.html'))).to.exist
            expect(file(path.join(outputDirectory, 'another-card', 'index.html'))).to.exist
        })
    })
})
