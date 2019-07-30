'use strict'

// -- imports

const path = require('path')

const Usm = require('../src/usm/usm')
// If you have installed this package via npm, you do
//      const Usm = require('usm.io')

// -- context

const context = {
    inputDir: path.join(__dirname, 'input'),
    outputDir: path.join(__dirname, 'web'),
    cardsWebroot: 'cards'
}

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
    const usm = new Usm(context)

    // render usm:
    await usm.renderMap(mapOptions)

    // render card packages.
    await usm.renderCards(cardsOptions)

    console.log(
        'json data was rendered and written into a html file in the "' +
        context.outputDir +
        '" folder.'
    )
    console.log('Open it in your browser to see the result!')
}
main()
