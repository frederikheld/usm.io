'use strict'

// -- imports

const path = require('path')

const Usm = require('../usm/usm')
// If you have installed this package via npm, you do
//      const Usm = require('usm.io')

// -- context

const context = {
    inputDir: path.join(__dirname, 'input'),
    outputDir: path.join(__dirname, 'web'),
    cardsWebroot: 'cards'
}

// -- main

const main = async function () {
    // NOTE: usm.io will put the links to css and js files into the respective tags
    //       exactly as they are given here.
    //       So they need to be relative to the output file!
    const mapOptions = {
        css: './styles.css',
        js: './scripts.js',
        timeline: true
    }

    const cardsOptions = {
        css: './../../cards-styles.css'
    }

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
