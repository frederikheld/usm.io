'use strict'

module.exports = Card

const fs = require('fs').promises
const path = require('path')

function Card (jsonCard) {
    if (jsonCard === undefined) {
        throw new ReferenceError('Card information missing! Please pass json object!')
    }

    if ((!(jsonCard instanceof Object)) || Array.isArray(jsonCard)) {
        throw new TypeError('Card information is not a json object!')
    }

    this.jsonData = jsonCard
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
Card.prototype.load = async function () {
    return new Promise(async (resolve, reject) => {
        if (this.jsonData) {
            if (this.jsonData.package) {
                if (!this.jsonData.package.inputDir) {
                    reject(new ReferenceError('"package" given but "package.inputDir" missing!'))
                } else {
                    try {
                        const cardRaw = await fs.readFile(path.join(process.cwd(), this.jsonData.package.inputDir, 'card.json'))

                        const cardJson = JSON.parse(cardRaw)

                        // NOTE: The usual __dirname won't work in this case as we are dealing with paths relative
                        //       to the calling file. This is why process.cwd() is used here.

                        this.jsonData = Object.assign(cardJson, this.jsonData)

                        this.packageLoaded = true

                        resolve()
                    } catch (err) {
                        reject(new ReferenceError('Could not read from "card.json" in ' + this.jsonData.package.inputDir))
                    }
                }
            }
        }
    })
}

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
        if (!this.packageLoaded) {
            throw new Error('Your json card description contains a link to a package that needs to be loaded before it can be rendered. Please run Card.load() before you run Card.render()!')
        }
        if (this.jsonData.package.outputDir) {
            result += '\n    <button onclick="window.location.href=\'./temp/card/card-package/index.html\'">Open Package</button>'
        } else {
            result += '\n    <button disabled>Open Package</button>'
        }
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
