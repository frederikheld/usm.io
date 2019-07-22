'use strict'

module.exports = PageRenderer

const fs = require('fs').promises
const path = require('path')
const mustache = require('mustache')

const MarkupRenderer = require('../markup-renderer')

function PageRenderer (renderOptions) {
    this.renderOptions = renderOptions
}

PageRenderer.prototype.render = async function (inputPath, outputPath) {
    let output = ''

    if (this.renderOptions && this.renderOptions.header) {
        output += await this.__renderTemplate(this.renderOptions.header.template, this.renderOptions.header.props)
    }

    const input = await fs.readFile(inputPath, { encoding: 'utf-8' })

    const mr = new MarkupRenderer(this.renderOptions)
    output += mr.render(input)

    if (this.renderOptions && this.renderOptions.footer) {
        output += await this.__renderTemplate(this.renderOptions.footer.template, this.renderOptions.footer.props)
    }

    await fs.writeFile(path.join(outputPath), output)
}

PageRenderer.prototype.__renderTemplate = async function (template, props) {
    if (!template) {
        throw new RangeError('"template" missing in "header" or "footer"') // TODO: "in header or footer" <-- this is not cool! Be precise!
    }

    if (!props) {
        throw new RangeError('"props" missing in "header" or "footer"')
    }

    const templateSource = await fs.readFile(template, { encoding: 'utf-8' })

    return mustache.render(templateSource, props)
}
