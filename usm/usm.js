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
