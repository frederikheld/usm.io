'use strict'

module.exports = Card

const fsSync = require('fs')
const path = require('path')

function Card (jsonCard, context) {
    if (jsonCard === undefined) {
        throw new ReferenceError(
            'Card information missing! Please pass json object!'
        )
    }

    if (!(jsonCard instanceof Object) || Array.isArray(jsonCard)) {
        throw new TypeError('Card information is not a json object!')
    }

    if (jsonCard.tags && !Array.isArray(jsonCard.tags)) {
        throw new TypeError('Value of field "tags" has to be an array!')
    }

    if (jsonCard.acceptanceCriteria && !Array.isArray(jsonCard.acceptanceCriteria)) {
        throw new TypeError('Value of field "acceptanceCriteria" has to be an array!')
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
    if (this.jsonData.package) {
        const jsonCardPath = path.join(
            this.context.inputDir,
            'cards',
            this.jsonData.package,
            'card.json'
        )

        let cardRaw
        try {
            cardRaw = fsSync.readFileSync(jsonCardPath)
        } catch (err) {
            throw new ReferenceError(
                'Could not read from "card.json" in package "' +
                    this.jsonData.package +
                    '"'
            )
        }

        let cardJson
        try {
            cardJson = JSON.parse(cardRaw)
        } catch (err) {
            throw new SyntaxError(
                'Object in "card.json" in package "' +
                    this.jsonData.package +
                    '" is malformed'
            )
        }

        this.jsonData = Object.assign(cardJson, this.jsonData)
    }
}

Card.prototype.render = function () {
    let result = '<div class="card'

    if (this.jsonData.package) {
        result += ' has-package'
    }

    if (this.jsonData.tags) {
        for (let i = 0; i < this.jsonData.tags.length; i++) {
            result += ' tag-' + this.jsonData.tags[i]
        }
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

    if (this.jsonData.acceptanceCriteria) {
        result += '\n    <div class="acceptance-criteria">'
        result += '\n    <h2>Acceptance Criteria</h2>'
        result += '\n        <ol>'
        for (let i = 0; i < this.jsonData.acceptanceCriteria.length; i++) {
            result += '\n            <li>' + this.jsonData.acceptanceCriteria[i] + '</li>'
        }
        result += '\n        </ol>'
        result += '\n    </div>'
    }

    if (this.jsonData.package) {
        result +=
            '\n    <button class="open-package" onclick="window.location.href=\'' +
            'cards' +
            '/' +
            this.jsonData.package +
            '/index.html\'">Open Package</button>'
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
