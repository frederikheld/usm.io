'use strict'

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Usm = require('../usm')

describe('usm.io', function () {
    it('can render an user story map utilizing the full feature set', async function () {
        const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'integration', 'mock-all-features.json'))
        const jsonUsm = JSON.parse(rawUsm)

        const usm = new Usm(jsonUsm)

        let htmlRendered = usm.renderMap({
            css: './path/to/stylesheet.css',
            js: './path/to/script.js'
        })
        let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'integration', 'mock-all-features.html'), 'utf8')

        helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
    })
})
