'use strict'

module.exports = PageRenderer

const fs = require('fs').promises
const mustache = require('mustache')

const MarkupRenderer = require('../markup-renderer')

function PageRenderer (renderOptions) {
    this.renderOptions = renderOptions
}

PageRenderer.prototype.render = function (input, pageMeta) {
    const mr = new MarkupRenderer(this.renderOptions)
    const output = mr.render(input, pageMeta.fileExtension)

    return this.__addHeaderAndFooter(output, this.renderOptions.header, this.renderOptions.footer)
}

PageRenderer.prototype.__addHeaderAndFooter = async function (main, header, footer) {
    const promises = []

    if (header) {
        if (!header.template) {
            throw new RangeError('"template" missing in "header"')
        }
        promises.push(this.__loadAndRenderTemplate(header.template, header.props))
    }

    if (footer) {
        if (!footer.template) {
            throw new RangeError('"template" missing in "footer"')
        }
        promises.push(this.__loadAndRenderTemplate(footer.template, footer.props))
    }

    const [headerSource, footerSource] = await Promise.all(promises)

    return headerSource + main + footerSource
}

PageRenderer.prototype.__loadAndRenderTemplate = async function (templatePath, props) {
    const headerSource = await fs.readFile(templatePath, { encoding: 'utf-8' })
    return mustache.render(headerSource, props)
}
