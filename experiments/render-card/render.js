'use strict'

const md = require('markdown-it')()
// const fs = require('fs').promises
const fs = require('fs-extra')
const path = require('path')

async function main () {
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
