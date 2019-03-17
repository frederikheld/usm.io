'use strict'

module.exports = Card

const fsSync = require('fs')
const path = require('path')

const readJsonCardFromFile = function (absolutePath) {
    let jsonCardFromFileRaw
    let jsonCardFromFile

    // try to read from path directly (assuming it is a file):
    try {
        jsonCardFromFileRaw = fsSync.readFileSync(absolutePath)
    } catch (err) {
        if (err.code === 'EISDIR') {
            // path is not a file but a directory
            try {
                // try to read from default file card.json:
                jsonCardFromFileRaw = fsSync.readFileSync(path.join(absolutePath, 'card.json'))
            } catch (err) {
                // card.json not found:
                throw new ReferenceError('"card.json" not found in directory "' + absolutePath + '"')
            }
        } else if (err.code === 'ENOENT') {
            // path is neither a file nor a directory:
            throw new RangeError('"' + absolutePath + '" is not a valid path. ' + '"link" should contain a valid path to a file or directory!')
        } else {
            // something with reading the directory went wrong
            throw err
        }
    }

    jsonCardFromFile = JSON.parse(jsonCardFromFileRaw)

    return jsonCardFromFile
}

function Card (jsonCard) {
    if (jsonCard === undefined) {
        throw new ReferenceError('Card description missing! Please pass json object or link to json file.')
    }

    if ((!(jsonCard instanceof Object) && !(typeof (jsonCard) === 'string')) || Array.isArray(jsonCard)) {
        throw new TypeError('Card description missing! Please pass json object or link to json file.')
    }

    this.jsonData = {}

    // jsonCard is an object:
    if (jsonCard instanceof Object) {
        this.jsonData = jsonCard

        if ('link' in jsonCard) {
            // make path absolute:
            let jsonPath = path.join(__dirname, jsonCard.link)

            let jsonCardFromFile = readJsonCardFromFile(jsonPath)

            // merge card from file with given card:
            Object.assign(this.jsonData, jsonCardFromFile)
        }

    // jsonCard is a string:
    } else if (typeof (jsonCard) === 'string') {
        // path is already absolute:
        let jsonPath = jsonCard

        let jsonCardFromFile = readJsonCardFromFile(jsonPath)

        // merge card from file with given card:
        Object.assign(this.jsonData, jsonCardFromFile)
    }

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
