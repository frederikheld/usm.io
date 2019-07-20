'use strict'

const fs = require('fs')
const path = require('path')
const RenderEngine = require('./modules/RenderEngine')

const renderOptions = {
    header: {
        template: './templates/header.html',
        props: {
            title: 'Hello Template!',
            'stylesheet-global': './../assets/css-global.css',
            'stylesheet-typo': './../assets/css-typo.css'
        }
    },
    footer: {
        template: './templates/footer.html',
        props: {
            version: '0.1',
            rendertime: new Date().toISOString().replace('T', ' ').substr(0, 19)
        }
    }
}

const re = new RenderEngine()
const output = re.render(renderOptions)

console.log(output)

fs.writeFileSync(path.join('output', 'index.html'), output)
