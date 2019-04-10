'use strict'

const md = require('markdown-it')()
const fs = require('fs-extra')
const path = require('path')
const readdirp = require('readdirp')

const config = {
    'inputDir': path.join(__dirname, 'cards'),
    'outputDir': path.join(__dirname, 'dist')
}

async function main () {
    // find all files in input directory tree:
    readdirRecursive(config.inputDir, async (err, res) => {
        if (err) {
            throw err
        }

        let allFiles = res

        console.log(allFiles)

        // render each file
        allFiles.forEach(async (file) => {
            // skip card.json as this file contains only meta data of the card:
            if (file.name === 'card.json') {
                return
            }

            // create target file tree in ouputDir:
            await fs.mkdirp(path.join(config.outputDir, file.parentDirRelative))

            // render or copy & paste files:
            if (file.extension === 'md') {
                // read markdown from file
                let markdownInput = await fs.readFile(file.pathAbsolute, { encoding: 'utf-8' })

                // replace all .md file extensions in relative links with .html:
                const regex = /(\[.*\]\((?!.*:\/\/).*)(\.md)(.*\))/gmi
                markdownInput = markdownInput.replace(regex, '$1.html$3')

                // render markdown to html:
                var htmlOutput = md.render(markdownInput)

                // write into file:
                let outputFileName = file.name.split('.').shift() + '.html'
                let outputPath = path.join(config.outputDir, file.parentDirRelative, outputFileName)
                await fs.writeFile(outputPath, htmlOutput)

                console.log("RENDERED '" + file.pathAbsolute + "' to '" + outputPath + "'")
            } else {
                let outputPath = path.join(config.outputDir, file.parentDirRelative, file.name)
                await fs.copyFile(file.pathAbsolute, outputPath, (err) => {
                    if (err) {
                        throw err
                    }

                    console.log("COPIED '" + file.pathAbsolute + "' to '" + outputPath + "'")
                })
            }
        })

        // // render markdown files, copy & paste all other files:
        // let markdownInput = await fs.readFile(path.join(__dirname, 'cards', 'markdown-card', 'index.md'), { encoding: 'utf-8' })
        // console.log(markdownInput)

        // // render markdown to html:
        // var htmlOutput = md.render(markdownInput)

        // // write into file:
        // await fs.mkdirp(path.join(__dirname, 'dist', 'markdown-card'))
        // await fs.writeFile(path.join(__dirname, 'dist', 'markdown-card', 'index.html'), htmlOutput)
    })
}
main()

/**
 * Reads a directory recursively and returns a
 * list of objects that contain different representations
 * of their path for each file.
 *
 * Source: https://ourcodeworld.com/articles/read/420/how-to-read-recursively-a-directory-in-node-js
 *
 * @param {path} dir
 * @param {callback} done
 */
function readdirRecursive (dir, done) {
    let readdirpSettings = {
        root: dir,
        entryType: 'files'
    }

    let allFilePaths = []

    readdirp(readdirpSettings)
        .on('data', (entry) => {
            allFilePaths.push({
                'name': entry.name,
                'extension': entry.name.split('.').pop(),
                'pathRelative': entry.path,
                'pathAbsolute': entry.fullPath,
                'parentDirRelative': entry.parentDir,
                'parentDirAbsolute': entry.fullParentDir
            })
        })
        .on('warn', (warning) => {
            console.log('Warning: ', warning)
        })
        .on('error', (error) => {
            done(new Error(error), null)
        })
        .on('end', () => {
            done(null, allFilePaths)
        })
}

/**
 * Reads a directory recursively and returns a
 * list of all file paths.
 *
 * Paths are absolute
 *
 * Source: https://ourcodeworld.com/articles/read/420/how-to-read-recursively-a-directory-in-node-js
 *
 * @param {path} dir
 * @param {callback} done
 */
// async function readdirRecursive (dir, done) {
//     let results = []

//     fs.readdir(dir, function (err, list) {
//         if (err) {
//             done(err)
//         }

//         var pending = list.length

//         if (!pending) {
//             return done(null, results)
//         }

//         list.forEach(function (file) {
//             file = path.resolve(dir, file)

//             fs.stat(file, function (err, stat) {
//                 if (err) {
//                     done(err, null)
//                 }

//                 if (stat && stat.isDirectory()) {
//                     // results.push(file) // don't add directories to results because we don't need them

//                     readdirRecursive(file, function (err, res) {
//                         if (err) {
//                             done(err, null)
//                         }

//                         results = results.concat(res)
//                         if (!--pending) done(null, results)
//                     })
//                 } else {
//                     results.push(file)

//                     if (!--pending) {
//                         done(null, results)
//                     }
//                 }
//             })
//         })
//     })
// }
