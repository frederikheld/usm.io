'use strict'

const fsExtra = require('fs-extra')

const ActivitiesContainer = require('./activities')

module.exports = Usm

function Usm (jsonUsm) {
    if (jsonUsm === undefined) {
        throw new ReferenceError('No USM object given!')
    }

    if (!(jsonUsm instanceof Object) || Array.isArray(jsonUsm)) {
        throw new TypeError('Given USM object is not an object!')
    }

    this.jsonUsm = jsonUsm

    if (this.jsonUsm.activities) {
        this.activities = new ActivitiesContainer(this.jsonUsm.activities)
    }
}

/**
 * Right now this is just copying all files from the input directory
 * to the output directory. Later it will convert everything that
 * isn't html into html.
 */
Usm.prototype.renderPackages = async function (outputPath, inputPath, options) {
    await fsExtra.copy(inputPath, outputPath)
}

Usm.prototype.render = function (config) {
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
                throw new TypeError('Key "css" of configuration object has to be a string!')
            }
            result += '\n    <link rel="stylesheet" type="text/css" href="' + config.css + '">'
        }

        if (config.js) {
            if (typeof (config.js) !== 'string') {
                throw new TypeError('Key "js" of configuration object has to be a string!')
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

    return result
}
