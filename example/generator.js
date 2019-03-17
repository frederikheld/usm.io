'use strict'

const fs = require('fs').promises
const path = require('path')

const Usm = require('../usm/usm')
// If you have installed this package via npm, you do
//      const Usm = require('usm.io')

let main = async function () {
    const usmJson = JSON.parse(await fs.readFile(path.join('input', 'usm-example.json')))

    const options = {
        'css': './styles.css',
        'js': './scripts.js',
        'timeline': true
    }
    // NOTE: usm.io will put the links to css and js files into the respective tags
    //       exactly as they are given here.
    //       So they need to be relative to the output file!
    const usm = new Usm(usmJson)

    const usmHtml = usm.render(options)

    await fs.writeFile(
        path.join('web', 'usm-example.html'),
        usmHtml,
        {
            encoding: 'utf-8'
        }
    )

    console.log('json data was rendered and written into a html file in the "web" folder.')
    console.log('Open it in your browser to see the result!')
}
main()
