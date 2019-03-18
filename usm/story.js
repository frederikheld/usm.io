'use strict'

module.exports = Story

const fsSync = require('fs')
const path = require('path')

const Card = require('./card')

const readJsonStoryFromFile = function (absolutePath) {
    let jsonStoryFromFileRaw
    let jsonStoryFromFile

    // try to read from path directly (assuming it is a file):
    try {
        jsonStoryFromFileRaw = fsSync.readFileSync(absolutePath)
    } catch (err) {
        if (err.code === 'EISDIR') {
            // path is not a file but a directory
            try {
                // try to read from default file story.json:
                jsonStoryFromFileRaw = fsSync.readFileSync(path.join(absolutePath, 'story.json'))
            } catch (err) {
                // story.json not found:
                throw new ReferenceError('"story.json" not found in directory "' + absolutePath + '"')
            }
        } else if (err.code === 'ENOENT') {
            // path is neither a file nor a directory:
            throw new RangeError('"' + absolutePath + '" is not a valid path. ' + '"link" should contain a valid path to a file or directory!')
        } else {
            // something with reading the directory went wrong
            throw err
        }
    }

    jsonStoryFromFile = JSON.parse(jsonStoryFromFileRaw)

    return jsonStoryFromFile
}

function Story (jsonStory) {
    if (jsonStory === undefined) {
        throw new ReferenceError('Card description missing! Please pass json object or link to json file.')
    }

    if ((!(jsonStory instanceof Object) && !(typeof (jsonStory) === 'string')) || Array.isArray(jsonStory)) {
        throw new TypeError('Card description missing! Please pass json object or link to json file.')
    }

    this.jsonData = {}

    // jsonStory is an object:
    if (jsonStory instanceof Object) {
        this.jsonData = jsonStory

        if ('link' in jsonStory) {
            // make path absolute:
            let jsonPath = path.join(__dirname, jsonStory.link)

            let jsonStoryFromFile = readJsonStoryFromFile(jsonPath)

            // merge card from file with given card:
            Object.assign(this.jsonData, jsonStoryFromFile)
        }

    // jsonStory is a string:
    } else if (typeof (jsonStory) === 'string') {
        // path is already absolute:
        let jsonPath = jsonStory

        let jsonStoryFromFile = readJsonStoryFromFile(jsonPath)

        // merge card from file with given card:
        Object.assign(this.jsonData, jsonStoryFromFile)
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

Story.prototype.render = function () {
    let result = '<div class="story'

    if (this.jsonData.inRelease) {
        result += ' release-' + this.jsonData.inRelease
    }

    result += '">'
    const compareForEmptyTagCompensation = result

    let cardInfo = {}
    if (this.jsonData.title) {
        cardInfo.title = this.jsonData.title
    }

    if (this.jsonData.description) {
        cardInfo.description = this.jsonData.description
    }

    if (this.jsonData.title || this.jsonData.description) {
        const card = new Card(cardInfo)
        result += '\n    ' + card.render()
    }

    if (this.jsonData.entrypoint) {
        result += '\n    <input type="button" class="btn_open_story" onclick="location.href=\''
        result += this.jsonData.entrypoint
        result += '\'" value="Open Story">'
    }

    if (result !== compareForEmptyTagCompensation) {
        result += '\n'
    }
    result += '</div>'

    return result
}
