'use strict'

module.exports = Stories

const Story = require('./story')

function Stories (jsonStories) {
    if (jsonStories === undefined) {
        throw new ReferenceError('No list of Stories given!')
    }

    if (!Array.isArray(jsonStories)) {
        throw new TypeError('Given Stories is not a list!')
    }

    this.jsonData = jsonStories
    this.stories = []

    for (let i = 0; i < this.jsonData.length; i++) {
        this.stories.push(new Story(this.jsonData[i]))
    }
}

Stories.prototype.render = function () {
    let result = '<div class="stories">'

    if (this.stories.length > 0) {
        for (let i = 0; i < this.stories.length; i++) {
            result += '\n    ' + this.stories[i].render()
        }
        result += '\n'
    }

    result += '</div>'

    return result
}
