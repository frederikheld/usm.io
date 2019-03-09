'use strict'

const path = require('path')

const chai = require('chai')
// const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const Activities = require('../activities')

describe('activities', () => {
    describe('the constructor Activities()', () => {
        it('expects an array', () => {
            expect(() => { new Activities([]) }).to.not.throw()
        })

        it('throws an error if passed data is not a list', () => {
            expect(() => { new Activities('This is not a list') }).to.throw(TypeError)
            expect(() => { new Activities({}) }).to.throw(TypeError)
        })

        it('throws an error if no data is passed at all', () => {
            expect(() => { new Activities() }).to.throw(ReferenceError)
        })
    })

    describe('Activities.prototype.render()', () => {
        // context('this.jsonData is invalid', () => {

        // })

        context('this.jsonData is valid', () => {
            it('can render an empty Activities container', async () => {
                return activitiesRenderComparator('mock-activities-empty')
            })

            it('can render multiple empty Activities into the container', async () => {
                return activitiesRenderComparator('mock-activities-multiple-empty')
            })
        })
    })
})

/**
 * This function takes the name of a mock data file
 * and returns an Activities object prepared with the data.
 *
 * This function is asynchronous due to the async
 * file operation that loads the mock data!
 *
 * @param {string} mockFilename
 */
async function activitiesMockupFactory (mockFilename) {
    const rawActivities = await fs.readFile(path.join(__dirname, 'mock-data', mockFilename))
    const jsonACtivities = JSON.parse(rawActivities)
    return new Activities(jsonACtivities)
}

/**
 * This function takes the name of a mock data file
 * and returns it's contents as a string.
 *
 * Can be used to load the expected result created
 * by Activities.render() from a prepared mock file.
 *
 * @param {string} mockFilename
 */
async function getMockString (mockFilename) {
    const html = await fs.readFile(path.join(__dirname, 'mock-data', mockFilename), { encoding: 'utf8' })
    return html
}

/**
 * Compares the rendered result of Activities.render()
 * with a prepared mock result.
 *
 * @param {string} mockName
 */
async function activitiesRenderComparator (mockName) {
    const activities = await activitiesMockupFactory(mockName + '.json')
    const mockHtml = await getMockString(mockName + '.html')
    const htmlRendered = activities.render()
    return htmlRendered.should.equal(mockHtml)
}
