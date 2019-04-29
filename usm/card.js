'use strict'

module.exports = Card

const fsSync = require('fs')
const path = require('path')

function Card (jsonCard, context) {
    if (jsonCard === undefined) {
        throw new ReferenceError('Card information missing! Please pass json object!')
    }

    if ((!(jsonCard instanceof Object)) || Array.isArray(jsonCard)) {
        throw new TypeError('Card information is not a json object!')
    }

    this.jsonData = jsonCard

    if (context === undefined) {
        throw new ReferenceError('No context object given!')
    }

    if (!(context instanceof Object) || Array.isArray(context)) {
        throw new TypeError('Given context is not an object!')
    }

    this.context = context

    // this.packageIsLoaded = false

    this._load()
}

/**
 * This function needs to be run if the object passed into
 * the constructor contains a link to a package.
 *
 * It will load "card.json" from the package and merge it
 * with this.jsonData.
 *
 * Fields that already exist in this.jsonData will not be
 * overwritten.
 */

Card.prototype._load = function () {
    if (this.jsonData) {
        if (this.jsonData.package) {
            const jsonCardPath = path.join(this.context.inputDir, 'cards', this.jsonData.package, 'card.json')
            try {
                const cardRaw = fsSync.readFileSync(jsonCardPath)
                const cardJson = JSON.parse(cardRaw)

                this.jsonData = Object.assign(cardJson, this.jsonData)

                // this.packageIsLoaded = true
            } catch (err) {
                throw new ReferenceError('Could not read from "card.json" in package "' + this.jsonData.package + '"')
            }
        }
    }
}
// Card.prototype.load = async function () {
//     return new Promise(async (resolve, reject) => {
//         if (this.jsonData) {
//             if (this.jsonData.package) {
//                 const jsonCardPath = path.join(this.context.inputDir, 'cards', this.jsonData.package, 'card.json')
//                 try {
//                     const cardRaw = await fs.readFile(jsonCardPath)
//                     const cardJson = JSON.parse(cardRaw)

//                     this.jsonData = Object.assign(cardJson, this.jsonData)

//                     this.packageIsLoaded = true

//                     resolve()
//                 } catch (err) {
//                     reject(new ReferenceError('Could not read from "card.json" in package "' + this.jsonData.package + '"'))
//                 }
//             }
//         }
//     })
// }

Card.prototype.render = function () {
    let result = '<div class="card">'
    const compareForEmptyTag = result

    if (this.jsonData.title) {
        result += '\n    <h1>' + this.jsonData.title + '</h1>'
    }

    if (this.jsonData.description) {
        result += '\n    <div class="description">'
        result += '\n' + this.jsonData.description
        result += '\n    </div>'
    }

    if (this.jsonData.package) {
        result += '\n    <button class="open-package" onclick="window.location.href=\'' + this.context.outputDir + '/cards/' + this.jsonData.package + '/index.html\'">Open Package</button>'
    }

    if (result !== compareForEmptyTag) {
        result += '\n'
    }
    result += '</div>'

    return result
}

Card.prototype.get = function (key) {
    return this.jsonData[key]
}
