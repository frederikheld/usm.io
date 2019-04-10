'use strict'

const md = require('markdown-it')()
// const fs = require('fs').promises
const fs = require('fs-extra')
const path = require('path')

async function main () {
    // find all files in input directory tree:
    readdirRecursive(path.join(__dirname, 'cards'), (err, res) => {
        if (err) {
            throw err
        }

        console.log(res)
    })

    // load from file:
    let markdownInput = await fs.readFile(path.join(__dirname, 'cards', 'markdown-card', 'index.md'), { encoding: 'utf-8' })
    console.log(markdownInput)

    // render markdown to html:
    var htmlOutput = md.render(markdownInput)

    // write into file:
    await fs.mkdirp(path.join(__dirname, 'dist', 'markdown-card'))
    await fs.writeFile(path.join(__dirname, 'dist', 'markdown-card', 'index.html'), htmlOutput)
}
main()

/**
 * Reads a directory recursively and returns a
 * list of all file paths.
 *
 * Source: https://ourcodeworld.com/articles/read/420/how-to-read-recursively-a-directory-in-node-js
 *
 * @param {path} dir
 * @param {callback} done
 */
async function readdirRecursive (dir, done) {
    let results = []

    fs.readdir(dir, function (err, list) {
        if (err) {
            done(err)
        }

        var pending = list.length

        if (!pending) {
            return done(null, results)
        }

        list.forEach(function (file) {
            file = path.resolve(dir, file)

            fs.stat(file, function (err, stat) {
                if (err) {
                    done(err, null)
                }

                if (stat && stat.isDirectory()) {
                    // results.push(file) // don't add directories to results because we don't need them

                    readdirRecursive(file, function (err, res) {
                        if (err) {
                            done(err, null)
                        }

                        results = results.concat(res)
                        if (!--pending) done(null, results)
                    })
                } else {
                    results.push(file)

                    if (!--pending) {
                        done(null, results)
                    }
                }
            })
        })
    })
}
