'use strict'

const fs = require('fs').promises
const fsExtra = require('fs-extra')
const readdirp = require('readdirp')
const path = require('path')

const PageRenderer = require('./page-renderer')

module.exports = RenderEngine

/**
 *                               reads header
 *                                and footer
 *                                from file
 *    reads file and                  |                      decides which
 *    meta info from                  v                     markup language
 *      input dir               mustache.render()              to render
 *          |                         |                           |
 *          v                         v                           v
 *  RenderEngine.render() <-- PageRenderer.render() <-- MarkupRenderer.render() <-- MarkdownIt.render()
 *          |                                                                   <-- unprocessed html
 *          v
 *      writes to
 *     output file
 */

function RenderEngine (renderOptions) {
    this.renderOptions = renderOptions
}

RenderEngine.prototype.renderAllCards = async function (inputDir, outputDir) {
    try {
        await fs.stat(inputDir)
    } catch (e) {
        throw new ReferenceError('"inputDir" "' + inputDir + '" does not exist!')
    }

    try {
        await fs.stat(outputDir)
    } catch (e) {
        throw new ReferenceError('"outputDir" "' + outputDir + '" does not exist!')
    }

    const pages = await this.__getAllFiles(inputDir)

    const promises = pages.map(async (pageMeta) => {
        return this.processFile(pageMeta, outputDir)
    })

    await Promise.all(promises)
}

RenderEngine.prototype.processFile = async function (pageMeta, outputDir) {
    const fileOutputDir = path.join(outputDir, pageMeta.parentDirRelative)

    try {
        await this.__renderFile(pageMeta, fileOutputDir)
    } catch (e) {
        return this.__copyFile(pageMeta, fileOutputDir)
    }
}

RenderEngine.prototype.__renderFile = async function (pageMeta, fileOutputDir) {
    const pr = new PageRenderer(this.renderOptions)

    const outputFilePath = path.join(fileOutputDir, pageMeta.name + '.html')

    const [, input] = await Promise.all([
        fsExtra.mkdirp(fileOutputDir),
        fs.readFile(pageMeta.pathAbsolute, { encoding: 'utf-8' })
    ])

    const output = await pr.render(input, pageMeta)

    return fs.writeFile(path.join(outputFilePath), output)
}

RenderEngine.prototype.__copyFile = async function (pageMeta, fileOutputDir) {
    const inputFilePath = pageMeta.pathAbsolute
    const outputFilePath = path.join(fileOutputDir, pageMeta.fileName)

    await fsExtra.mkdirp(fileOutputDir)
    return fsExtra.copyFile(inputFilePath, outputFilePath)
}

RenderEngine.prototype.__getAllFiles = async function (inputDir) {
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

    const allFilePaths = []

    return new Promise((resolve, reject) => {
        readdirp(inputDir, readdirpSettings)
            .on('data', (entry) => {
                let omit = false
                if (this.renderOptions &&
                    this.renderOptions.filesToOmit &&
                    this.renderOptions.filesToOmit.includes(entry.basename)
                ) {
                    omit = true
                }
                if (!omit) {
                    allFilePaths.push({
                        fileName: entry.basename,
                        name: entry.basename.split('.').shift(),
                        fileExtension: entry.basename.split('.').pop(),
                        pathRelative: entry.path,
                        pathAbsolute: entry.fullPath,
                        parentDirRelative: path.dirname(entry.path),
                        parentDirAbsolute: path.dirname(entry.fullPath)
                    })
                }
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
