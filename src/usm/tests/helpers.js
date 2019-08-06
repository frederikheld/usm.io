'use strict'

const fsExtra = require('fs-extra')

// TODO: Move this to /lib/helpers/

const helpers = {}

/**
 * Takes a string. Strips all whitespaces from string.
 * Returns stripped string.
 *
 * Useful to compare mock html with generated html.
 *
 * @param {string} string
 */
helpers.stripWhitespaces = function (string) {
    const regex = new RegExp(/\r*\s*(.*)\r*$/gm)
    return string.replace(regex, '$1')
}

module.exports = helpers
