'use strict'

module.exports = Activities

// const logger = require('../logger/logger')

const Activity = require('./activity')

function Activities (jsonActivities) {
    if (jsonActivities === undefined) {
        throw new ReferenceError('No list of Activities given!')
    }

    if (!Array.isArray(jsonActivities)) {
        throw new TypeError('Given Activities is not a list!')
    }

    this.jsonData = jsonActivities
    this.activities = []

    for (let i = 0; i < this.jsonData.length; i++) {
        this.activities.push(new Activity(this.jsonData[i]))
    }
}

Activities.prototype.render = function () {
    let result = '<div class="activities">'

    if (this.activities.length > 0) {
        for (let i = 0; i < this.activities.length; i++) {
            result += '\n    ' + this.activities[i].render()
        }
        result += '\n'
    }

    result += '</div>'

    return result
}
