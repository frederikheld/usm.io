'use strict'

// const logger = require('../logger/logger')

module.exports = Card

function Card (jsonCard) {
    if (jsonCard === undefined) {
        throw new ReferenceError('No Card object given!')
    }

    if (!(jsonCard instanceof Object) || Array.isArray(jsonCard)) {
        throw new TypeError('Given Card object is not an object!')
    }

    this.jsonData = jsonCard
}

Card.prototype.render = function () {
    let result = '<div class="card'

    if (this.jsonData.inRelease) {
        result += ' release-' + this.jsonData.inRelease
    }

    result += '">'

    if (this.jsonData.title) {
        result += '\n    <h1>' + this.jsonData.title + '</h1>\n'
    }

    if (this.jsonData.description) {
        result += '\n    <div class="description">\n'
        result += this.jsonData.description
        result += '\n    </div>\n'
    }

    result += '</div>'

    return result
}
