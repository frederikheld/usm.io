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

    this.jsonData = {}

    // jsonCard is an object:
    if (jsonCard instanceof Object) {
        this.jsonData = jsonCard

        if ('link' in jsonCard) {
            let jsonCardFromFileRaw

            // make path absolute:
            let jsonPath = path.join(__dirname, jsonCard.link)

            // try to read from path directly (assuming it is a file):
            try {
                jsonCardFromFileRaw = fsSync.readFileSync(jsonPath)
            } catch (err) {
                if (err.code === 'EISDIR') {
                    // path is not a file but a directory
                    try {
                        // try to read from default file card.json:
                        jsonCardFromFileRaw = fsSync.readFileSync(path.join(jsonPath, 'card.json'))
                    } catch (err) {
                        // card.json not found:
                        throw new ReferenceError('"card.json" not found in directory "' + jsonPath + '"')
                    }
                } else if (err.code === 'ENOENT') {
                    // path is neither a file nor a directory:
                    throw new RangeError('"' + jsonPath + '" is not a valid path. ' + '"link" should contain a valid path to a file or directory!')
                } else {
                    // something with reading the directory went wrong
                    throw err
                }
            }

            // merge card from file with given card:
            let jsonCardFromFile = JSON.parse(jsonCardFromFileRaw)
            Object.assign(this.jsonData, jsonCardFromFile)
        }
    }

    // // load json data from somewhere:
    // this.jsonData = {}
    // if (jsonCard instanceof Object) {
    //     this.jsonData = jsonCard
    // } else {
    //     console.log('jsonCard: ' + jsonCard)

    //     // make path absolute:
    //     // let jsonPath = path.join(__dirname, jsonCard)
    //     let jsonPath = jsonCard
    //     console.log('abs path: ' + jsonPath)

    //     // Load json from file
    //     let jsonCardFromFileRaw
    //     try {
    //         // Try to read from given path directly:
    //         jsonCardFromFileRaw = fsSync.readFileSync(jsonPath)
    //     } catch (err) {
    //         if (err.code === 'ENOENT') {
    //             // err: no such file or directory --> string is not a path
    //             throw err
    //         } else if (err.code === 'EISDIR') {
    //             // err: illegal operation on directory --> string is not a path to a file
    //             try {
    //                 // try to read from 'card.json' in the given directory:
    //                 console.log('default path: ' + path.join(jsonPath, 'card.json'))
    //                 // jsonCardFromFileRaw = fsSync.readFileSync(path.join(jsonPath, 'card.json'))
    //             } catch (err) {
    //                 // Still can't read
    //                 console.log('something broken with reading from the file')
    //                 throw err
    //             }
    //         } else {
    //             console.log('something unexpected')
    //             throw err
    //         }
    //     }
    //     let jsonCardFromFile = JSON.parse(jsonCardFromFileRaw)

    //     Object.assign(this.jsonData, jsonCardFromFile)
    //     /**
    //      * FIXIT: It is an anti-pattern to synchronously load
    //      * from a file. But it is the most user-friendly and
    //      * clean implementation I came up with. All async implementations
    //      * would require another function besides the constructor to be
    //      * called since the constructor itself can't be async.
    //      * As there are many cards in an usm, this should be made
    //      * async in some way!
    //      */
    // }

    // resolve link if given:
    // if ('link' in this.jsonData) {
    //     let jsonCardFromFileRaw
    //     try {
    //         jsonCardFromFileRaw = fsSync.readFileSync(path.join(__dirname, this.jsonData['link']))
    //     } catch (err) {
    //         throw err
    //     }
    //     let jsonCardFromFile = JSON.parse(jsonCardFromFileRaw)

    //     Object.assign(this.jsonData, jsonCardFromFile)
    // }
    // NOTE: This will also resolve links in a file that was given direktly as a link, but only one level deep.
    // TODO: Is this behavior intended?
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
