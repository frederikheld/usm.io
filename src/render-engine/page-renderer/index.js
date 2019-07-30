'use strict'

module.exports = PageRenderer

const fs = require('fs').promises
const mustache = require('mustache')

const MarkupRenderer = require('../markup-renderer')

function PageRenderer (renderOptions) {
    this.renderOptions = renderOptions
}

PageRenderer.prototype.render = async function (input, pageMeta) {
    const mr = new MarkupRenderer(this.renderOptions)

    /* Next line will be ignored from coverage report as this is a workaround
     * for the issue that missing object properties can't be accessed at all
     * instead of returning undefined. Undefined is exactly what should be passed
     * if the object property is missing. Then MarkupRenderer.render() will
     * defualt to 'html': This behavior is tested in MarkupRenderer itself.
     * To repeat that test here would break separation of concerns.
     *
     * A fix for this JS issue is proposed for next ECMA standard:
     * https://github.com/tc39/proposal-optional-chaining
     */
    /* istanbul ignore next */
    const inputRendered = mr.render(input, (pageMeta ? pageMeta.fileExtension : undefined))

    let promiseHeader = Promise.resolve('')
    let promiseFooter = Promise.resolve('')

    if (this.renderOptions) {
        if (this.renderOptions.header) {
            if (!this.renderOptions.header.template) {
                throw new ReferenceError('"template" missing in "header"!')
            }
            promiseHeader = this.__loadAndRenderTemplate(this.renderOptions.header.template, this.renderOptions.header.props)
        }

        if (this.renderOptions.footer) {
            if (!this.renderOptions.footer.template) {
                throw new ReferenceError('"template" missing in "footer"!')
            }
            promiseFooter = this.__loadAndRenderTemplate(this.renderOptions.footer.template, this.renderOptions.footer.props)
        }

        const [header, footer] = await Promise.all([promiseHeader, promiseFooter])

        let output = ''
        if (header !== '') {
            output += header + '\n'
        }

        output += inputRendered

        if (footer !== '') {
            output += '\n' + footer
        }
        return output
    }
    return input
}

PageRenderer.prototype.__loadAndRenderTemplate = async function (templatePath, props) {
    const headerSource = await fs.readFile(templatePath, { encoding: 'utf-8' })
    return mustache.render(headerSource, props)
}
