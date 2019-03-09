'use strict'

const path = require('path')

const chai = require('chai')
// const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const Activity = require('../activity')

describe('activity', () => {
    describe('the constructor Activity()', () => {
        it('expects an object', () => {
            expect(() => { new Activity({}) }).to.not.throw()
        })

        it('throws an error if passed data is not a json object', () => {
            expect(() => { new Activity('This is not an object') }).to.throw(TypeError)
            expect(() => { new Activity([]) }).to.throw(TypeError)
        })

        it('throws an error if no data is passed at all', () => {
            expect(() => { new Activity() }).to.throw(ReferenceError)
        })
    })

    describe('Activity.prototype.render()', () => {
        // context('this.jsonData is invalid', () => {

        // })

        context('this.jsonData is valid', () => {
            it('renders an empty Activity container', async () => {
                return activityRenderComparator('mock-activity-empty')
            })

            it('renders an Activity card with empty steps container', async () => {
                return activityRenderComparator('mock-activity-steps-empty', true)
            })
        })
    })
})

/**
 * This function takes the name of a mock data file
 * and returns an Activity object prepared with the data.
 *
 * This function is asynchronous due to the async
 * file operation that loads the mock data!
 *
 * @param {string} mockFilename
 */
async function activityMockupFactory (mockFilename) {
    const rawActivity = await fs.readFile(path.join(__dirname, 'mock-data', mockFilename))
    const jsonActivity = JSON.parse(rawActivity)
    return new Activity(jsonActivity)
}

/**
 * This function takes the name of a mock data file
 * and returns it's contents as a string.
 *
 * Can be used to load the expected result created
 * by Usm.render() from a prepared mock file.
 *
 * @param {string} mockFilename
 */
async function getMockString (mockFilename) {
    const html = await fs.readFile(path.join(__dirname, 'mock-data', mockFilename), { encoding: 'utf8' })
    return html
}

/**
 * Compares the rendered result of Activity.render()
 * with a prepared mock result.
 *
 * @param {string} mockName
 */
async function activityRenderComparator (mockName, ignoreWhitespaces = false) {
    const activity = await activityMockupFactory(mockName + '.json')
    let mockHtml = await getMockString(mockName + '.html')
    let htmlRendered = activity.render()

    if (ignoreWhitespaces) {
        const regex = new RegExp(/\r*\s*(.*)\r*$/gm)
        mockHtml = mockHtml.replace(regex, '$1')
        htmlRendered = htmlRendered.replace(regex, '$1')
    }

    return htmlRendered.should.equal(mockHtml)
}
