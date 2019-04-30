'use strict'

const path = require('path')

const chai = require('chai')
chai.should()

const fs = require('fs').promises

const helpers = require('./helpers')

const Usm = require('../usm')

describe('integration', function () {
    beforeEach(async function () {
        await helpers.cleanUpDir(path.join(__dirname, 'temp', 'output'))
    })

    it('can render an user story map with all of its elements', async function () {
        const usmContext = {
            inputDir: path.join(__dirname, 'mock-data', 'integration', 'input'),
            outputDir: path.join(__dirname, 'temp', 'output')
        }

        console.log(usmContext.inputDir)

        const usm = new Usm(usmContext)

        const mapOptions = {
            css: './path/to/stylesheet.css',
            js: './path/to/script.js'
        }

        await usm.renderMap(mapOptions)

        let htmlRendered = await fs.readFile(path.join(usmContext.outputDir, 'index.html'), 'utf-8')
        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'integration', 'expected-output', 'index.html'), 'utf8')

        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
    })

    // Rendering card packages is already tested in usm.test.js.
})
