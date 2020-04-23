'use strict'

module.exports = MarkupRenderer

const md = require('markdown-it')()

function MarkupRenderer (renderOptions) {
    this.renderOptions = renderOptions
}

MarkupRenderer.prototype.render = function (input, markupLanguage) {
    if (markupLanguage) {
        if (markupLanguage === 'md') {
            return this.renderMarkdown(input)
        } else if (markupLanguage === 'html') {
            return input
        } else {
            throw new TypeError('"' + markupLanguage + '" is not a supported markup language!')
        }
    }

    return input
}

MarkupRenderer.prototype.renderMarkdown = function (input) {
    try {
        if (this.renderOptions.markdown.replaceLinks === true) {
            // replace all .md file extensions in relative links with .html:
            const regex = /(\[.*\]\((?!.*:\/\/).*)(\.md)(.*\))/gim
            input = input.replace(regex, '$1.html$3')
        }
    } catch (e) { }

    const output = md.render(input)
    return output
}
