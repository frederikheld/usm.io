'use strict'

module.exports = Card

const fsSync = require('fs')
const path = require('path')

function Card (jsonCard) {
    if (jsonCard === undefined) {
        throw new ReferenceError('Card description missing! Please pass json object or link to json file.')
    }

    if ((!(jsonCard instanceof Object) && !(typeof (jsonCard) === 'string')) || Array.isArray(jsonCard)) {
        throw new TypeError('Card description missing! Please pass json object or link to json file.')
    }

    // load json data from somewhere:
    this.jsonData = {}
    if (jsonCard instanceof Object) {
        this.jsonData = jsonCard
    } else {
        // Load json from file
        let jsonCardFromFileRaw
        try {
            jsonCardFromFileRaw = fsSync.readFileSync(jsonCard)
        } catch (err) {
            throw err
        }
        let jsonCardFromFile = JSON.parse(jsonCardFromFileRaw)

        Object.assign(this.jsonData, jsonCardFromFile)
        /**
         * FIXIT: It is an anti-pattern to synchronously load
         * from a file. But it is the most user-friendly and
         * clean implementation I came up with. All async implementations
         * would require another function besides the constructor to be
         * called since the constructor itself can't be async.
         * As there are many cards in an usm, this should be made
         * async in some way!
         */
    }

    // resolve link if given:
    if ('link' in this.jsonData) {
        let jsonCardFromFileRaw
        try {
            jsonCardFromFileRaw = fsSync.readFileSync(path.join(__dirname, this.jsonData['link']))
        } catch (err) {
            throw err
        }
        let jsonCardFromFile = JSON.parse(jsonCardFromFileRaw)

        Object.assign(this.jsonData, jsonCardFromFile)
    }
    // NOTE: This will also resolve links in a file that was given direktly as a link.
}

Card.prototype.render = function () {
    let result = '<div class="card'

    if (this.jsonData.inRelease) {
        result += ' release-' + this.jsonData.inRelease
    }

    result += '">'
    const compareForEmptyTag = result

    if (this.jsonData.title) {
        result += '\n    <h1>' + this.jsonData.title + '</h1>'
    }

    if (this.jsonData.description) {
        result += '\n    <div class="description">'
        result += '\n' + this.jsonData.description
        result += '\n    </div>'
    }

    if (result !== compareForEmptyTag) {
        result += '\n'
    }
    result += '</div>'

    return result
}
