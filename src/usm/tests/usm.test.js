'use strict'

const chai = require('chai')
chai.should()
const expect = chai.expect

const chaiFiles = require('chai-files')
chai.use(chaiFiles)

const fs = require('fs').promises
const fsExtra = require('fs-extra')
const path = require('path')

const Usm = require('../usm')
const Activities = require('../activities')

describe('usm', function () {
    // describe('the constructor Usm(context)', function () {
    // })

    const tempDir = path.join(process.cwd(), 'temp', 'usm.test')

    before(async () => {
        await fsExtra.emptyDir(tempDir)
    })

    after(async () => {
        await fsExtra.remove(tempDir)
    })

    describe('Usm.prototype.getContext(field)', function () {
        const usmContext = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.getContext', 'input'),
            outputDir: path.join(tempDir, 'output')
        }

        it('returns the whole context object if "field" is not given', function () {
            const usm = new Usm(usmContext)
            usm.getContext().should.equal(usmContext)
        })

        it('returns the value fo the requested field', function () {
            const usm = new Usm(usmContext)
            usm.getContext('inputDir').should.equal(usmContext.inputDir)
        })

        it('throws an ReferenceError if requested field doesn\'t exist', function () {
            const usm = new Usm(usmContext)
            expect(function () {
                usm.getContext('nonExistentField')
            }).to.throw(RangeError, 'ERROR: Field "nonExistentField" doesn\'t exist!')
        })

        // TODO: context object gets enriched with releases, if releases given with map
    })

    describe('Usm.prototype.getUsm()', function () {
        const usmContext = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.getUsm', 'input'),
            outputDir: path.join(tempDir, 'output')
        }

        it('returns the usm object that was loaded from "usm.json" in the "inputDir"', async function () {
            const usm = new Usm(usmContext)

            const usmObjectExpected = JSON.parse(await fs.readFile(path.join(usmContext.inputDir, 'usm.json')))
            usm.getUsm().should.deep.equal(usmObjectExpected)
        })
    })

    describe('Usm.prototype.getActivities()', function () {
        const usmContext = {
            inputDir: path.join(__dirname, 'mock-data', 'usm.getActivities', 'input'),
            outputDir: path.join(tempDir, 'output')
        }

        it('returns the Activities object generated from the json usm object', function () {
            const usm = new Usm(usmContext)
            usm.getActivities().should.be.instanceOf(Activities)
        })
    })
})
