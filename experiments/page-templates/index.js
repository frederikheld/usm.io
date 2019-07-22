'use strict'

const fsExtra = require('fs-extra')
const path = require('path')

const RenderEngine = require('./modules/render-engine')

const renderOptions = {
    inputDir: path.join(__dirname, 'input'),
    outputDir: path.join(__dirname, 'output'),
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

/**
 * prepares       reads all                    adds                    translates
 *  output      file info from              header and                 markup into
 *   dir          input dir                   footer                      html
 *    |               |                         |                           |
 *    v               v                         v                           v
 *  index --> RenderEngine.render() --> PageRenderer.render() --> MarkupRenderer.render() --> MarkdownIt.render()
 *                    |             --> copy & paste                                      --> unprocessed html
 *                    v                 to outputDir                                      --> ASCIIdoc?
 *                write to
 *               output file
 */

async function main() {
    const startTime = new Date()

    await fsExtra.mkdirp(renderOptions.outputDir)
    await fsExtra.emptyDir(renderOptions.outputDir)

    const re = new RenderEngine(renderOptions)
    await re.render()

    const executionTime = new Date() - startTime

    console.log('Rendered cards from')
    console.log('    ' + renderOptions.inputDir)
    console.log('to')
    console.log('    ' + renderOptions.outputDir)
    console.log('This took ' + executionTime + 'ms')
}
main()
