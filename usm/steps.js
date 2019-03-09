'use strict'

module.exports = Steps

// const logger = require('../logger/logger')

const Step = require('./step')

function Steps (jsonSteps) {
    if (jsonSteps === undefined) {
        throw new ReferenceError('No list of Steps given!')
    }

    if (!Array.isArray(jsonSteps)) {
        throw new TypeError('Given Steps is not a list!')
    }

    this.jsonData = jsonSteps
    this.steps = []

    for (let i = 0; i < this.jsonData.length; i++) {
        this.steps.push(new Step(this.jsonData[i]))
    }
}

Steps.prototype.render = function () {
    let result = '<div class="steps">'

    if (this.steps.length > 0) {
        for (let i = 0; i < this.steps.length; i++) {
            result += '\n    ' + this.steps[i].render()
        }
        result += '\n'
    }

    result += '</div>'

    return result
}
