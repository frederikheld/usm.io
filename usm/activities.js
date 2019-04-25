'use strict'

module.exports = Activities

const Activity = require('./activity')

function Activities (jsonActivities, context) {
    if (jsonActivities === undefined) {
        throw new ReferenceError('No list of Activities given!')
    }

    if (!Array.isArray(jsonActivities)) {
        throw new TypeError('Given Activities is not a list!')
    }

    this.jsonData = jsonActivities

    if (context === undefined) {
        throw new ReferenceError('No context given')
    }

    if (context === undefined) {
        throw new ReferenceError('No context object given!')
    }

    if (!(context instanceof Object) || Array.isArray(context)) {
        throw new TypeError('Given context is not an object!')
    }

    this.context = context

    this.activities = []

    for (let i = 0; i < this.jsonData.length; i++) {
        this.activities.push(new Activity(this.jsonData[i], this.context))
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
