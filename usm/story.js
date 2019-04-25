'use strict'

module.exports = Story

const Card = require('./card')

const fsSync = require('fs')
const path = require('path')

function Story (jsonStory, context) {
    if (jsonStory === undefined) {
        throw new ReferenceError('Card description missing! Please pass a json.')
    }

    if ((!(jsonStory instanceof Object)) || Array.isArray(jsonStory)) {
        throw new TypeError('Card description missing! Please pass json object or link to json file.')
    }

    this.jsonData = jsonStory

    if (context === undefined) {
        throw new ReferenceError('No context object given!')
    }

    if (!(context instanceof Object) || Array.isArray(context)) {
        throw new TypeError('Given context is not an object!')
    }

    this.context = context
}

Story.prototype.render = function () {
    let result = '<div class="story">'

    let cardInfo = {}
    if (this.jsonData.title) {
        cardInfo.title = this.jsonData.title
    }

    if (this.jsonData.description) {
        cardInfo.description = this.jsonData.description
    }

    // let cardInfo = {
    //     title: this.jsonData.title || undefined,
    //     description: this.jsonData.description || undefined
    // }

    if (this.jsonData.title || this.jsonData.description) {
        const card = new Card(cardInfo, context)
        result += '\n    ' + card.render()
    }

    result += '</div>'

    return result
}
