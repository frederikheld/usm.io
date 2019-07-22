'use strict'

const fsExtra = require('fs-extra')
const readdirp = require('readdirp')
const path = require('path')

const PageRenderer = require('../page-renderer')

module.exports = RenderEngine

function RenderEngine (renderOptions) {
    this.renderOptions = renderOptions
}

RenderEngine.prototype.render = async function (filePath) {
    const pages = await this.__getAllPages(this.renderOptions.inputDir)

    const cr = new PageRenderer(this.renderOptions)
    const promises = pages.map(async (page) => {
        const outputDir = path.join(
            this.renderOptions.outputDir,
            page.parentDirRelative
        )
        fsExtra.mkdirp(outputDir)

        const outputFile = path.join(outputDir, page.name + '.html')
        cr.render(page.pathAbsolute, outputFile)
        // ^- Noteworthy: Those render() calls run in parallel through map().
        //    Promise.all() will wait for all of them to resolve.
        //    If you add await in front of the render() call, this will await
        //    each call individually and thus run dem sequentially.
        //    This will slow down execution dramatically. Try it!
    })

    await Promise.all(promises)
}

RenderEngine.prototype.__getAllPages = async function (inputDir) {
    /**
     * Reads a directory recursively and returns a
     * list of objects that contain different representations
     * of their path for each file.
     *
     * Source: https://ourcodeworld.com/articles/read/420/how-to-read-recursively-a-directory-in-node-js
     */
    const readdirpSettings = {
        type: 'files'
    }

    var allFilePaths = []

    return new Promise((resolve, reject) => {
        readdirp(inputDir, readdirpSettings)
            .on('data', (entry) => {
                allFilePaths.push({
                    file: entry.basename,
                    name: entry.basename.split('.').shift(),
                    extension: entry.basename.split('.').pop(),
                    pathRelative: entry.path,
                    pathAbsolute: entry.fullPath,
                    parentDirRelative: path.dirname(entry.path),
                    parentDirAbsolute: path.dirname(entry.fullPath)
                })
            })
            // .on('warn', (warning) => {
            //     console.log('Warning: ', warning)
            // })
            // .on('error', (error) => {
            //     reject(error)
            // })
            .on('end', () => {
                resolve(allFilePaths)
            })
    })
}
