'use strict'

const fs = require('fs').promises
const fsExtra = require('fs-extra')
const readdirp = require('readdirp')
const path = require('path')

const PageRenderer = require('../page-renderer')

module.exports = RenderEngine

function RenderEngine (renderOptions) {
    this.renderOptions = renderOptions
}

RenderEngine.prototype.render = async function (inputDir, outputDir) {
    const pages = await this.__getAllPages(inputDir)

    const promises = pages.map(async (pageMeta) => {
        this.renderFile(pageMeta, outputDir)
        // ^- Noteworthy: Those calls run in parallel through map().
        //    Promise.all() will wait for all of them to resolve.
        //    If you add await in front of the call, this will await
        //    each call individually and thus run dem sequentially.
        //    This will slow down execution dramatically. Try it!
    })

    await Promise.all(promises)
}

RenderEngine.prototype.renderFile = async function (pageMeta, outputDir) {
    const pr = new PageRenderer(this.renderOptions)

    const pageOutputDir = path.join(outputDir, pageMeta.parentDirRelative)
    const outputFilePath = path.join(pageOutputDir, pageMeta.name + '.html')

    const [, input] = await Promise.all([
        fsExtra.mkdirp(pageOutputDir),
        fs.readFile(pageMeta.pathAbsolute, { encoding: 'utf-8' })
    ])

    const output = await pr.render(input, pageMeta)

    fs.writeFile(path.join(outputFilePath), output)
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
                    fileName: entry.basename,
                    name: entry.basename.split('.').shift(),
                    fileExtension: entry.basename.split('.').pop(),
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
