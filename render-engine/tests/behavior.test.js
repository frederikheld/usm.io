'use strict'

const chai = require('chai')
chai.should()
const expect = chai.expect

const RenderEngine = require('../index.js')

describe.only('render-engine', function () {
    describe('The constructor RenderEngine', function () {
        it('takes an "options" object as parameter', function () {
            const options = {}

            expect(() => { new RenderEngine(options) }).to.not.throw()
        })

        it('doesn\'t expect "options"', function () {
            expect(() => { new RenderEngine() }).to.not.throw()
        })

        it('throws an error if something other than an object is passed as "options"', function () {
            const options = 'foo'

            expect(() => { new RenderEngine(options) }).to.throw(TypeError, 'Render configuration has to be an object!')
        })
    })

    describe('renderMarkdown()', function () {
        it('renders the given "input" as markdown and returns the rendered html', function () {
            const input = `# Heading first order

Some text in a paragraph

## Heading second order

    Sourcecode here

Another paragraph`

            const expectedOutput = `<h1>Heading first order</h1>
<p>Some text in a paragraph</p>
<h2>Heading second order</h2>
<pre><code>Sourcecode here
</code></pre>
<p>Another paragraph</p>
`

            const re = new RenderEngine()

            const output = re.renderMarkdown(input)

            output.should.equal(expectedOutput)
        })

        describe('link replacement', function () {
            it('replaces ".md" file extension in relative links with ".html" if "replaceRelativeLinks" is set to "true"', function () {
                const input = `[a link to another page](./path/to/index.md)

[a link to another website](http://example.com/index.md)
`
                const expectedOutput = `<p><a href="./path/to/index.html">a link to another page</a></p>
<p><a href="http://example.com/index.md">a link to another website</a></p>\n`

                const re = new RenderEngine({
                    replaceRelativeLinks: true
                })

                const output = re.renderMarkdown(input)
                output.should.equal(expectedOutput)
            })

            it('doesn\'t replace .md file extension in relative links by .html if "replaceRelativeLinks" is set to "false"', function () {
                const input = `[a link to another page](./path/to/index.md)`
                const expectedOutput = `<p><a href="./path/to/index.md">a link to another page</a></p>\n`

                const re = new RenderEngine({
                    replaceRelativeLinks: false
                })

                const output = re.renderMarkdown(input)
                output.should.equal(expectedOutput)
            })

            it('defaults to "false" if "replaceRelativeLinks" is not defined', function () {
                const input = `[a link to another page](./path/to/index.md)`
                const expectedOutput = `<p><a href="./path/to/index.md">a link to another page</a></p>\n`

                const re = new RenderEngine({})

                const output = re.renderMarkdown(input)
                output.should.equal(expectedOutput)
            })

            it('throws a TypeError if the type of "replaceRelativeLinks" in options is not boolean', function () {
                const options = {
                    replaceRelativeLinks: 'foo'
                }

                expect(() => { new RenderEngine(options) }).to.throw(TypeError, 'Field "replaceRelativeLinks" in options has to be of type "boolean"')
            })
        })
    })

    describe('renderHtml()', function () {
        it('returns the given "input" without any processing', function () {
            const input = `<h1>Heading first order</h1>
            
<p>Hello World!</p>
`

            const re = new RenderEngine()

            const output = re.renderHtml(input)
            output.should.equal(input)
        })
    })

    // describe('renderCard()', function () {
    //     it('it renders the "input" from markdown to html if "markup: md" specified in "options"', function () {
    //     })
    // })
})
