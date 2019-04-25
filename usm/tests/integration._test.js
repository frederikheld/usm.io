'use strict'

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Usm = require('../usm')

describe('usm.io', function () {
    beforeEach(async function () {
        await helpers.cleanUpDir(path.join(__dirname, 'temp', 'output'))
    })

    it('can render an user story map utilizing the full feature set', async function () {
        const context = {
            inputDir: path.join(__dirname, 'mock-data', 'integration', 'input'),
            outputDir: path.join(__dirname, 'temp', 'output')
        }

        const usm = new Usm(context)

        const config = {
            css: './path/to/stylesheet.css',
            js: './path/to/script.js'
        }

        await usm.renderMap(config)

        let htmlRendered = await fs.readFile(path.join(context.outputDir, 'index.html'), 'utf-8')
        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'integration', 'mock-output', 'index.html'), 'utf8')

        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
    })
})
