'use strict'

module.exports = Card

function Card (jsonCard) {
    if (jsonCard === undefined) {
        throw new ReferenceError('Card description missing! Please pass json object!')
    }

    if ((!(jsonCard instanceof Object)) || Array.isArray(jsonCard)) {
        throw new TypeError('Card description is not a json object!')
    }

    this.jsonData = jsonCard
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

    if (result !== compareForEmptyTag) {
        result += '\n'
    }
    result += '</div>'

    return result
}
