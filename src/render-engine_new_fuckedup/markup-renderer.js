'use strict'

const md = require('markdown-it')()

module.exports = MarkupRenderer

function MarkupRenderer (options) {
    if (options) {
        if (typeof options !== 'object') {
            throw new TypeError('Render configuration has to be an object!')
        }

        if (options.replaceRelativeLinks) {
            if (typeof options.replaceRelativeLinks !== 'boolean') {
                throw new TypeError('Field "replaceRelativeLinks" in options has to be of type "boolean"')
            }
        }
    }

    this.options = options
}

MarkupRenderer.prototype.renderMarkdown = function (input) {
    if (this.options && this.options.replaceRelativeLinks === true) {
        const regex = /(\[.*\]\((?!.*:\/\/).*)(\.md)(.*\))/gim
        input = input.replace(regex, '$1.html$3')
    }

    const output = md.render(input)

    return output
}

MarkupRenderer.prototype.renderHtml = function (input) {
    const output = input
    return output
}
