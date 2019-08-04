'use strict'

// -- imports

const fsExtra = require('fs-extra')
const path = require('path')

const Usm = require('../src/usm/usm')
// If you have installed this package via npm, you do
//      const Usm = require('usm.io')

// -- context

const context = {
    inputDir: path.join(__dirname, 'input'),
    outputDir: path.join(__dirname, 'web')
}

// cardsWebroot can be relative to the map (index.html) or absolute.

const templateFooter = {
    template: path.join(__dirname, 'templates', 'footer.html'),
    props: {
        version: '0.1',
        rendertime: new Date().toISOString().replace('T', ' ').substr(0, 19)
    }
}

const mapOptions = {
    header: {
        template: path.join(__dirname, 'templates', 'header.html'),
        props: {
            title: 'Hello World!',
            'stylesheet-global': path.join(__dirname, '/web/assets/styles-global.css'),
            'stylesheet-specific': path.join(__dirname, '/web/assets/styles-map.css'),
            'scripts-specific': path.join(__dirname, '/web/assets/scripts-map.js'),
            'link-home': path.join(__dirname, '/web/index.html')
        }
    },
    footer: templateFooter,
    timeline: true
}

const cardsOptions = {
    header: {
        template: path.join(__dirname, 'templates', 'header.html'),
        props: {
            title: 'Hello World!',
            'stylesheet-global': path.join(__dirname, '/web/assets/styles-global.css'),
            'stylesheet-specific': path.join(__dirname, '/web/assets/styles-cards.css'),
            'link-home': path.join(__dirname, '/web/index.html')
        }
    },
    footer: templateFooter,
    markdown: {
        replaceLinks: true
    },
    filesToOmit: [
        'usm.json',
        'card.json'
    ]
}

// -- main

const main = async function () {
    // prepare output directory:
    await cleanupDirectory(context.outputDir)

    // render usm and cards:
    const usm = new Usm(context)
    await Promise.all([
        usm.renderMap(mapOptions),
        usm.renderCards(cardsOptions)
    ])

    // copy stylesheets and scripts to output directory:
    await fsExtra.mkdir(path.join(context.outputDir, 'assets'))
    await fsExtra.copy(
        path.join(__dirname, 'assets'),
        path.join(context.outputDir, 'assets')
    )

    console.log('json data was rendered and written into a html file in the "' + context.outputDir + '" folder.')
    console.log('Open it in your browser to see the result!')
}
main()

async function cleanupDirectory (dirPath) {
    try {
        await fsExtra.emptyDir(dirPath)
    } catch (err) {
        if (err.code === 'ENOENT') {
            // directory doesn't exist yet. That's okay, we will create it some lines below.
        } else {
            throw err
        }
    }
    await fsExtra.mkdirp(dirPath)
}
