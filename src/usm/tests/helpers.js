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

/**
 * Deletes all files and folders from a directory.
 * Creates the directory if it doesn't exist yet.
 */
helpers.cleanUpDir = async function (path) {
    try {
        await fsExtra.remove(path)
    } catch (err) {
        if (err.code === 'ENOENT') {
            // directory doesn't exist yet. That's okay, we will create it some lines below.
        } else {
            throw err
        }
    }
    await fsExtra.mkdirp(path)
}

module.exports = helpers
