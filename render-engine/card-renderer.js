'use strict'

module.exports = cardRenderer

const md = require('markdown-it')()
const fs = require('fs-extra')
const path = require('path')
const readdirp = require('readdirp')

function cardRenderer (cardDir, outputDir) {
    this.cardDir = cardDir
    this.outputDir = outputDir
}

cardRenderer.prototype.processFile = async function (file) {
    // skip card.json as this file contains only meta data of the card:
    if (file.name === 'card.json') {
        return
    }

    // create target file tree in ouputDir:
    // try {
    await fs.mkdirp(path.join(this.outputDir, file.parentDirRelative))
    // } catch (err) {
    //     throw err
    // }

    // render or copy & paste files:
    if (file.extension === 'md') {
        // read markdown from file
        let markdownInput = await fs.readFile(file.pathAbsolute, {
            encoding: 'utf-8'
        })

        // replace all .md file extensions in relative links with .html:
        const regex = /(\[.*\]\((?!.*:\/\/).*)(\.md)(.*\))/gim
        markdownInput = markdownInput.replace(regex, '$1.html$3')

        // render markdown to html:
        var htmlOutput = md.render(markdownInput)

        // write into file:
        let outputFileName = file.name.split('.').shift() + '.html'
        let outputPath = path.join(
            this.outputDir,
            file.parentDirRelative,
            outputFileName
        )
        // try {
        await fs.writeFile(outputPath, htmlOutput)
        // console.log("RENDERED '" + file.pathAbsolute + "' to '" + outputPath + "'")
        // } catch (err) {
        //     throw err
        // }
    } else {
        let outputPath = path.join(
            this.outputDir,
            file.parentDirRelative,
            file.name
        )
        // try {
        await fs.copy(file.pathAbsolute, outputPath)
        // console.log("COPIED '" + file.pathAbsolute + "' to '" + outputPath + "'")
        // } catch (err) {
        //     throw err
        // }
    }
}

cardRenderer.prototype.render = async function () {
    let allFiles = []

    // find all files in input directory tree:
    // try {
    allFiles = await readdirRecursive(this.cardDir)
    // } catch (err) {
    //     throw err
    // }

    // console.log(this.inputDir)
    // console.log(this.outputDir)
    // console.log('from card.render()', allFiles)

    // await processFiles(allFiles)

    // render all files:
    const promises = allFiles.map(this.processFile, this)
    await Promise.all(promises)
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
    let readdirpSettings = {
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
