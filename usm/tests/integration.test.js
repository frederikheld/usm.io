'use strict'

const path = require('path')

const chai = require('chai')
chai.should()

const fs = require('fs').promises

const helpers = require('./helpers')

const Usm = require('../usm')

describe('integration', function () {
    let tempDir = path.join(process.cwd(), 'temp', 'integration.test')

    beforeEach(async function () {
        await helpers.cleanUpDir(path.join(tempDir, 'output'))
    })

    const usmContext = {
        inputDir: path.join(__dirname, 'mock-data', 'integration', 'input'),
        outputDir: path.join(tempDir, 'output'),
        cardsWebroot: 'cards'
    }

    it('can render an user story map with all of its elements', async function () {
        const usm = new Usm(usmContext)

        const mapOptions = {
            css: './path/to/stylesheet.css',
            js: './path/to/script.js'
        }

        await usm.renderMap(mapOptions)

        let htmlRendered = await fs.readFile(
            path.join(usmContext.outputDir, 'index.html'),
            'utf-8'
        )
        let htmlExpected = await fs.readFile(
            path.join(
                __dirname,
                'mock-data',
                'integration',
                'expected-output',
                'index.html'
            ),
            'utf8'
        )

        helpers
            .stripWhitespaces(htmlRendered)
            .should.equal(helpers.stripWhitespaces(htmlExpected))
    })

    // TODO: Rendering card packages is already tested in usm.test.js but might better be tested here?
    // TODO: Linking between card in map and card package is somehow tested in render-engine,
    //       but those tests just check the output and don't really check if the link is leading to the right location.
})
