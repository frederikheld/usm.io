'use strict'

const Stories = require('./stories')
const Card = require('./card')

module.exports = Step

function Step (jsonStep, context) {
    if (jsonStep === undefined) {
        throw new ReferenceError('No Step object given!')
    }

    if (!(jsonStep instanceof Object) || Array.isArray(jsonStep)) {
        throw new TypeError('Given Step object is not an object!')
    }

    this.jsonData = jsonStep

    if (context === undefined) {
        throw new ReferenceError('No context object given!')
    }

    if (!(context instanceof Object) || Array.isArray(context)) {
        throw new TypeError('Given context is not an object!')
    }

    this.context = context

    if (this.jsonData.stories) {
        this.stories = new Stories(this.jsonData.stories)
    }
}

Step.prototype.render = function () {
    let result = '<div class="step">'

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
        const card = new Card(cardInfo, this.context)
        result += '\n    ' + card.render()
    }

    if (this.stories) {
        result += '\n    ' + this.stories.render() + '\n'
    }

    result += '</div>'

    return result
}
