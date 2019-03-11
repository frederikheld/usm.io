'use strict'

const fs = require('fs').promises
const path = require('path')

const Usm = require('../../usm/usm')
// If you have installed this package via npm, you do
//      const Usm = require('usm.io')

let main = async function () {
    const usmJson = JSON.parse(await fs.readFile(path.join('input', 'usm-example.json')))

    const options = {
        'css': path.join(__dirname, 'styles.css'),
        'js': path.join(__dirname, 'scripts.js'),
        'timeline': true
    }
    const usm = new Usm(usmJson)

    const usmHtml = usm.render(options)

    await fs.writeFile(
        path.join('output', 'usm-example.html'),
        usmHtml,
        {
            encoding: 'utf-8'
        }
    )

    console.log('json data was rendered and written into a html file in the "web" folder.')
    console.log('Open it in your browser to see the result!')
}
main()
