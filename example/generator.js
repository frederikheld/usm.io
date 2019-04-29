'use strict'

// -- imports

const path = require('path')

const Usm = require('../usm/usm')
// If you have installed this package via npm, you do
//      const Usm = require('usm.io')

// -- context

const context = {
    inputDir: path.join(__dirname, 'input'),
    outputDir: path.join(__dirname, 'web')
}

// -- main

let main = async function () {
    // NOTE: usm.io will put the links to css and js files into the respective tags
    //       exactly as they are given here.
    //       So they need to be relative to the output file!
    const options = {
        'css': './styles.css',
        'js': './scripts.js',
        'timeline': true
    }

    const usm = new Usm(context)

    // render usm:
    await usm.renderMap(options)

    // render card packages.
    await usm.renderCards()

    console.log('json data was rendered and written into a html file in the "' + context.outputDir + '" folder.')
    console.log('Open it in your browser to see the result!')
}
main()
