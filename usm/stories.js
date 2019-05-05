'use strict'

module.exports = Stories

const Story = require('./story')

function Stories (jsonStories, context) {
    if (jsonStories === undefined) {
        throw new ReferenceError('No list of Stories given!')
    }

    if (!Array.isArray(jsonStories)) {
        throw new TypeError('Given Stories is not a list!')
    }

    this.jsonData = jsonStories

    if (context === undefined) {
        throw new ReferenceError('No context object given!')
    }

    if (!(context instanceof Object) || Array.isArray(context)) {
        throw new TypeError('Given context is not an object!')
    }

    this.context = context

    this.stories = []

    for (let i = 0; i < this.jsonData.length; i++) {
        this.stories.push(new Story(this.jsonData[i], this.context))
    }
}

Stories.prototype.render = function () {
    // -- Sort Stories into releases

    let storiesPerRelease = {}

    if (this.context.releases) {
        // Extract release keys:
        let releaseKeys = []
        for (let i = 0; i < this.context.releases.length; i++) {
            releaseKeys.push(this.context.releases[i].key)
        }

        // Prepare array to sort releases into:
        for (let i = 0; i < releaseKeys.length; i++) {
            storiesPerRelease[releaseKeys[i]] = []
        }
        storiesPerRelease.__future = [] // collection for all stories that are not mapped to a release

        // Sort stories into releases:
        for (let i = 0; i < this.stories.length; i++) {
            let currentReleaseKey = this.stories[i].getRelease()
            if (releaseKeys.includes(currentReleaseKey)) {
                storiesPerRelease[currentReleaseKey].push(this.stories[i])
            } else {
                storiesPerRelease.__future.push(this.stories[i])
            }
        }
    } else {
        storiesPerRelease.__future = []
        for (let i = 0; i < this.stories.length; i++) {
            storiesPerRelease.__future.push(this.stories[i])
        }
    }

    // -- Render Stories insid release containers

    let result = '<div class="stories">'

    for (let releaseKey in storiesPerRelease) {
        result += '\n    <div class="release release-' + releaseKey + '">'
        for (let j = 0; j < storiesPerRelease[releaseKey].length; j++) {
            result += '\n        ' + storiesPerRelease[releaseKey][j].render()
        }
        result += '\n    </div>'
    }

    result += '</div>'

    return result
}
