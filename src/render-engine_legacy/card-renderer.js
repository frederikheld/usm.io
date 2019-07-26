'use strict'

module.exports = cardRenderer

const md = require('markdown-it')()
const fsExtra = require('fs-extra')
const path = require('path')
const readdirp = require('readdirp')

function cardRenderer (cardDir, outputDir) {
    this.cardDir = cardDir
    this.outputDir = outputDir
}

cardRenderer.prototype.processFile = async function (file, config) {
    // skip card.json as this file contains only meta data of the card:
    if (file.name === 'card.json') {
        return
    }

    // create target file tree in ouputDir:
    await fsExtra.mkdirp(path.join(this.outputDir, file.parentDirRelative))

    // render files:
    let htmlOutput = ''

    // add header:
    htmlOutput += this.__generateHeader(config)

    if (file.extension === 'md') {
        // read markdown from file
        let markdownInput = await fsExtra.readFile(file.pathAbsolute, {
            encoding: 'utf-8'
        })

        // replace all .md file extensions in relative links with .html:
        const regex = /(\[.*\]\((?!.*:\/\/).*)(\.md)(.*\))/gim
        markdownInput = markdownInput.replace(regex, '$1.html$3')

        // render markdown to html:
        htmlOutput += md.render(markdownInput)
    } else if (file.extension === 'html') {
        // read html from file
        const htmlInput = await fsExtra.readFile(file.pathAbsolute, {
            encoding: 'utf-8'
        })

        // TODO: Do HTML sanitation here?

        htmlOutput += htmlInput
    } else {
        // just copy and paste files that are not to be rendered:
        const outputPath = path.join(
            this.outputDir,
            file.parentDirRelative,
            file.name
        )

        await fsExtra.copy(file.pathAbsolute, outputPath)

        return
    }

    // add footer:
    htmlOutput += this.__generateFooter(config)

    // write into file:
    const outputFileName = file.name.split('.').shift() + '.html'
    const outputPath = path.join(
        this.outputDir,
        file.parentDirRelative,
        outputFileName
    )

    await fsExtra.writeFile(outputPath, htmlOutput)
}

cardRenderer.prototype.render = async function (config) {
    let allFiles = []

    // find all files in input directory tree:
    allFiles = await readdirRecursive(this.cardDir)

    // await processFiles(allFiles)

    // render all files:
    const promises = allFiles.map((file) => { return this.processFile(file, config) }, this)
    await Promise.all(promises)
}

cardRenderer.prototype.__generateHeader = function (config) {
    let html = `
<!doctype html>

<html>
    <head>
`

    if (config) {
        if (typeof (config) !== 'object') {
            throw new TypeError('Configuration object has to be an object!')
        }

        if (config.css) {
            let stylesheets = []
            if (typeof (config.css) === 'string') {
                stylesheets[0] = config.css
            } else if (Array.isArray(config.css)) {
                stylesheets = config.css
            } else {
                throw new TypeError('Value of field "css" in configuration object has to be a string or an array of strings!')
            }

            for (let i = 0; i < stylesheets.length; i++) {
                if (typeof (stylesheets[i]) === 'string') {
                    html += '        <link rel="stylesheet" type="text/css" href="' + stylesheets[i] + '">\n'
                } else {
                    throw new TypeError('Value of field "css" in configuration object has to be a string or an array of strings! Found element in array that is not a string.')
                }
            }
        }
    }

    html += `    </head>
    <body>
`

    return html
}

cardRenderer.prototype.__generateFooter = function (config) {
    const html = `
    </body>
</html>
`

    return html
}

/**
 * Reads a directory recursively and returns a
 * list of objects that contain different representations
 * of their path for each file.
 *
 * Source: https://ourcodeworld.com/articles/read/420/how-to-read-recursively-a-directory-in-node-js
 *
 * @param {path} dir
 */
async function readdirRecursive (dir) {
    const readdirpSettings = {
        type: 'files'
    }

    var allFilePaths = []

    return new Promise((resolve, reject) => {
        readdirp(dir, readdirpSettings)
            .on('data', (entry) => {
                allFilePaths.push({
                    name: entry.basename,
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
