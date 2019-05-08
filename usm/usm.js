'use strict'

const fs = require('fs').promises
const fsSync = require('fs')
const path = require('path')

const ActivitiesContainer = require('./activities')
const RenderEngine = require('../render-engine/render-engine')

module.exports = Usm

function Usm (context) {
    this.context = context

    // -- load usm object from "usm.json" in context.inputDir

    if (this.context && this.context.inputDir) {
        this.jsonUsm = this._loadUsmObjectFromFile(path.join(this.context.inputDir, 'usm.json'))

        // -- adds releases to context

        if (this.jsonUsm.releases) {
            this.context.releases = this.jsonUsm.releases
        }

        // -- prepare activities container

        if (this.jsonUsm.activities) {
            this.activities = new ActivitiesContainer(this.jsonUsm.activities, this.context)
        }
    }
}

Usm.prototype._loadUsmObjectFromFile = function (jsonUsmPath) {
    const jsonUsmRaw = fsSync.readFileSync(jsonUsmPath)
    return JSON.parse(jsonUsmRaw)
}

Usm.prototype.getActivities = function () {
    return this.activities
}

Usm.prototype.getContext = function (field = undefined) {
    if (undefined === field) {
        return this.context
    } else {
        if (this.context[field]) {
            return this.context[field]
        } else {
            throw new RangeError('ERROR: Field "' + field + '" doesn\'t exist!')
        }
    }
}

Usm.prototype.getUsm = function () {
    return this.jsonUsm
}

/**
 * Renders all Cards in inputDir to outputDir.
 */
Usm.prototype.renderCards = async function (options) {
    const re = new RenderEngine(this.context.inputDir, this.context.outputDir)
    await re.renderAllCards()
}

Usm.prototype.renderMap = async function (config) {
    // render header:
    let result = '<!DOCTYPE html>\n'
    result += '\n<html>\n'
    result += '\n<head>'
    result += '\n    <meta charset="utf-8">'
    result += '\n    <title>usm.io</title>'

    if (config) {
        if (typeof (config) !== 'object') {
            throw new TypeError('Configuration object has to be an object!')
        }

        if (config.css) {
            if (typeof (config.css) !== 'string') {
                throw new TypeError('Value of field "css" in configuration object has to be a string!')
            }
            result += '\n    <link rel="stylesheet" type="text/css" href="' + config.css + '">'
        }

        if (config.js) {
            if (typeof (config.js) !== 'string') {
                throw new TypeError('Value of field "js" in configuration object has to be a string!')
            }
            result += '\n    <script src="' + config.js + '"></script>'
        }
    }

    result += '\n    <style>'
    result += __generateReleasesCSS(this.jsonUsm, 8)
    result += '\n    </style>'

    result += '\n</head>\n'
    result += '\n<body>'

    // render usm:
    result += '<div class="usm">'
    if (this.activities) {
        result += '\n    ' + this.activities.render() + '\n'
    }

    let doRenderTimeline = false
    if (config) {
        if (config.timeline) {
            if (typeof (config.timeline) !== 'boolean') {
                throw new TypeError('Key "timeline" of configuration object has to be a boolean!')
            }
            doRenderTimeline = config.timeline
        }
    }
    if (doRenderTimeline) {
        result += '\n    <div class="timeline"></div>\n'
    }
    result += '</div>'

    // render footer:
    result += '\n</body>\n'
    result += '\n</html>'

    await fs.writeFile(path.join(this.context.outputDir, 'index.html'), result)
}

function __generateReleasesCSS (jsonUsm, indentBlanks) {
    const releases = jsonUsm.releases
    const activities = jsonUsm.activities

    // extract release keys:

    let releaseKeys = []
    for (let i = 0; i < releases.length; i++) {
        releaseKeys.push(releases[i].key)
    }

    // count max number of cards per release within a step:

    let maxCardsInRelease = {}
    for (let i = 0; i < releaseKeys.length; i++) {
        maxCardsInRelease[releaseKeys[i]] = 0
    }

    for (let aI = 0; aI < activities.length; aI++) {
        for (let sI = 0; sI < activities[aI].steps.length; sI++) {
            // prepare collection:
            let maxCardsInReleaseInStep = {}
            for (let i = 0; i < releaseKeys.length; i++) {
                maxCardsInReleaseInStep[releaseKeys[i]] = 0
            }

            // count occurences in step:
            for (let storiesI = 0; storiesI < activities[aI].steps[sI].stories.length; storiesI++) {
                if (activities[aI].steps[sI].stories[storiesI].inRelease) {
                    maxCardsInReleaseInStep[activities[aI].steps[sI].stories[storiesI].inRelease]++
                }
            }

            // update global collection:
            for (let key in maxCardsInReleaseInStep) {
                if (maxCardsInReleaseInStep[key] > maxCardsInRelease[key]) {
                    maxCardsInRelease[key] = maxCardsInReleaseInStep[key]
                }
            }
        }
    }

    // stories container:

    const blanks = new Array(indentBlanks + 1).join(' ')

    let result = '\n' + blanks + '.stories {'
    result += '\n' + blanks + '    grid-template-rows:'
    for (let i = 0; i < releases.length; i++) {
        result += ' calc(6.8rem * ' + (maxCardsInRelease[releaseKeys[i]]) + ')'
    }
    result += '\n' + blanks + '}'
    result += '\n'

    // position release containers

    for (let i = 0; i < releases.length; i++) {
        result += '\n' + blanks + '.release-' + releases[i].key + ' {'
        result += '\n' + blanks + '    grid-row-start: ' + (i + 1) + ';'
        result += '\n' + blanks + '    grid-row-end: ' + (i + 2) + ';'
        result += '\n' + blanks + '}'
    }
    result += '\n'

    // position release names:

    for (let i = 0; i < releases.length; i++) {
        result += '\n' + blanks + '.activity:first-child .step:first-child .release-' + releases[i].key + '::before {'
        result += '\n' + blanks + '    content: "' + releases[i].title + '";'
        result += '\n' + blanks + '    margin-top: calc(6.8rem * ' + (maxCardsInRelease[releaseKeys[i]]) + '/2 - 0.4rem);'
        result += '\n' + blanks + '    width: calc(6.8rem * ' + (maxCardsInRelease[releaseKeys[i]]) + ');'
        result += '\n' + blanks + '    left: calc(-3.42rem * ' + (maxCardsInRelease[releaseKeys[i]]) + ' + 0.8rem);'
        result += '\n' + blanks + '}'
    }

    // return result:

    return result
}
