'use strict'

module.exports = RenderEngine

const fs = require('fs')
const path = require('path')
const mustache = require('mustache')

function RenderEngine () {

}

RenderEngine.prototype.render = function (renderOptions) {
    let output = ''

    if (renderOptions && renderOptions.header) {
        output += this.__renderTemplate(renderOptions.header.template, renderOptions.header.props)
    }

    output += fs.readFileSync(path.join('input', 'main-content.html'))

    if (renderOptions && renderOptions.footer) {
        output += this.__renderTemplate(renderOptions.footer.template, renderOptions.footer.props)
    }

    return output
}

RenderEngine.prototype.__renderTemplate = function (template, props) {
    if (!template) {
        throw new RangeError('"template" missing in "header"')
    }

    if (!props) {
        throw new RangeError('"props" missing in "header"')
    }

    const templateSource = fs.readFileSync(template, { encoding: 'utf-8' })

    return mustache.render(templateSource, props)
}
