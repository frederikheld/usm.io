'use strict'

module.exports = Story

const Card = require('./card')

function Story (jsonStory, context) {
    if (jsonStory === undefined) {
        throw new ReferenceError('ERROR: No card description given! Please pass a json object.')
    }

    if ((!(jsonStory instanceof Object)) || Array.isArray(jsonStory)) {
        throw new TypeError('ERROR: Given card description is not a json object.')
    }

    this.jsonData = jsonStory

    if (context === undefined) {
        throw new ReferenceError('ERROR: No context object given!')
    }

    if (!(context instanceof Object) || Array.isArray(context)) {
        throw new TypeError('ERROR: Given context is not a json object!')
    }

    this.context = context
}

Story.prototype.render = function () {
    let result = '<div class="story">'

    const card = new Card(this.jsonData, this.context)
    result += '\n    ' + card.render()

    result += '</div>'

    return result
}

Story.prototype.getRelease = function () {
    return this.jsonData.inRelease
}
