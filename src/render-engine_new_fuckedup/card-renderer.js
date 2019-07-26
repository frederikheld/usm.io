'use strict'

const fs = require('fs').promises
const fsExtra = require('fs-extra')

const path = require('path')

const mr = require('./markup-renderer')

module.exports = CardRenderer

function CardRenderer (options) {
    if (options) {
        if (typeof options !== 'object') {
            throw new TypeError('Render configuration has to be an object!')
        }
    }

    this.options = options
}

CardRenderer.prototype.renderFile = async function (inputPath, outputPath) {
    if (inputPath === undefined) {
        return Promise.reject(new ReferenceError('Mandatory parameter "inputPath" missing!'))
    }

    if (outputPath === undefined) {
        return Promise.reject(new ReferenceError('Mandatory parameter "outputPath" missing!'))
    }

    let input = ''
    try {
        input = await fs.readFile(inputPath, {
            encoding: 'utf-8'
        })
    } catch (e) {
        return Promise.reject(new ReferenceError('Can\'t read from "inputPath"!\n' + e.message))
    }

    await fsExtra.mkdirp(path.join(outputPath))

    try {
        await fs.writeFile(outputPath, input)
    } catch (e) {
        return Promise.reject(new ReferenceError('Can\'t write to "outputPath"!\n' + e.message))
    }
}
