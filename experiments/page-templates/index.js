'use strict'

const fsExtra = require('fs-extra')
const path = require('path')

const RenderEngine = require('./modules/render-engine')

/**
 *                                         reads header
 *                                          and footer
 *                                          from file
 * prepares     reads file and                  |                      decides which
 *  output      meta info from                  v                     markup language
 *   dir          input dir               mustache.render()              to render
 *    |               |                         |                           |
 *    v               v                         v                           v
 *  index --> RenderEngine.render() <-> PageRenderer.render() <-> MarkupRenderer.render() <-> MarkdownIt.render()
 *                    |                                                                   <-> unprocessed html
 *                    v                                                                   <-> ASCIIdoc?
 *                writes to
 *               output file
 */

const renderOptions = {
    header: {
        template: path.join(__dirname, 'templates', 'header.html'),
        props: {
            title: 'Hello World!',
            'stylesheet-global': __dirname + '/assets/css-global.css',
            'stylesheet-typo': __dirname + '/assets/css-typo.css',
            'link-home': __dirname + '/output/index.html'
        }
    },
    footer: {
        template: path.join(__dirname, 'templates', 'footer.html'),
        props: {
            version: '0.1',
            rendertime: new Date().toISOString().replace('T', ' ').substr(0, 19)
        }
    },
    markdown: {
        replaceLinks: true
    }
}
// Note: For nested pages only absolute links will work :-(

const inputDir = path.join(__dirname, 'input')
const outputDir = path.join(__dirname, 'output')

async function main () {
    const startTime = new Date()

    await fsExtra.mkdirp(outputDir)
    await fsExtra.emptyDir(outputDir)

    const re = new RenderEngine(renderOptions)
    await re.render(inputDir, outputDir)

    const executionTime = new Date() - startTime

    console.log('Rendered cards from')
    console.log('    ' + inputDir)
    console.log('to')
    console.log('    ' + outputDir)
    console.log('This took ' + executionTime + 'ms')
}
main()
