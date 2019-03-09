'use strict'

// const logger = require('../logger/logger')

const Steps = require('./steps')
const Card = require('./card')

module.exports = Activity

function Activity (jsonActivity) {
    if (jsonActivity === undefined) {
        throw new ReferenceError('No Activity object given!')
    }

    if (!(jsonActivity instanceof Object) || Array.isArray(jsonActivity)) {
        throw new TypeError('Given Activity object is not an object!')
    }

    this.jsonData = jsonActivity

    if (this.jsonData.steps) {
        this.steps = new Steps(this.jsonData.steps)
    }
}

Activity.prototype.render = function () {
    let result = '<div class="activity">'

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

    if (this.steps) {
        result += '\n    ' + this.steps.render() + '\n'
    }

    result += '</div>'

    return result
}
