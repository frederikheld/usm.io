'use strict'

const chai = require('chai')
chai.should()
const expect = chai.expect

const fs = require('fs').promises
const fsSync = require('fs')

const path = require('path')

const MarkupRenderer = require('../index.js')

describe.only('MarkupRenderer', () => {
    describe('render()', () => {
        describe('the parameter "markdownLanguage"', () => {
            context('is "md"', () => {
                it('treats the string given as "input" as "markdown" and returns it rendered into "html"', () => {
                    const mr = new MarkupRenderer()

                    const inputData = '# This is a heading\n\nHello World!'

                    const expectedResult = '<h1>This is a heading</h1>\n<p>Hello World!</p>\n'

                    const result = mr.render(inputData, 'md')

                    result.should.equal(expectedResult)
                })

                describe('field "renderOptions.markdown.replaceLinks" passed with contructor', () => {

                    let input
                    before(async () => {
                        input = await fs.readFile(path.join(__dirname, 'mock-data', 'link-replacement', 'input.md'), { encoding: 'utf-8' })
                    })

                    context('is "true"', () => {
                        it('replaces links ending with ".md" with ".html"', async () => {
                            const mr = new MarkupRenderer({
                                markdown: {
                                    replaceLinks: true
                                }
                            })

                            const expectedResult = await fs.readFile(path.join(__dirname, 'mock-data', 'link-replacement', 'expected-output-with-replacement.html'), { encoding: 'utf-8' })
                            const result = mr.render(input, 'md')
                            result.should.contains(expectedResult)
                        })
                    })

                    context('is "false"', () => {
                        it('keeps links ending with ".md" as they are', async () => {
                            const mr = new MarkupRenderer({
                                markdown: {
                                    replaceLinks: false
                                }
                            })

                            const expectedResult = await fs.readFile(path.join(__dirname, 'mock-data', 'link-replacement', 'expected-output-without-replacement.html'), { encoding: 'utf-8' })
                            const result = mr.render(input, 'md')
                            result.should.contains(expectedResult)
                        })
                    })

                    context('is not given', () => {
                        it('keeps links ending with ".md" as they are', async () => {
                            const mr = new MarkupRenderer({
                                markdown: {
                                    replaceLinks: false
                                }
                            })

                            const expectedResult = await fs.readFile(path.join(__dirname, 'mock-data', 'link-replacement', 'expected-output-without-replacement.html'), { encoding: 'utf-8' })
                            const result = mr.render(input, 'md')
                            result.should.contains(expectedResult)
                        })
                    })

                })
            })

            context('is "html"', () => {
                it('treats the string given as "input" as "html" and returns it without any modifications', () => {
                    const mr = new MarkupRenderer()

                    const input = '<h1>This is a heading</h1><p>Hello World!</p>'
                    const result = mr.render(input, 'html')
                    result.should.equal(input)
                })
            })

            context('is not given', () => {
                it('returns the string given as "input" without any modifications if "markupLanguage" is not given', () => {
                    const mr = new MarkupRenderer()

                    const input = '<h1>This is a heading</h1><p>Hello World!</p>'
                    const result = mr.render(input)
                    result.should.equal(input)

                    const input2 = '# This is a heading\n\nHello World!'
                    const result2 = mr.render(input2)
                    result2.should.equal(input2)
                })
            })

            context('is neither "md" nor "html"', () => {
                it('throws a TypeError', () => {
                    const mr = new MarkupRenderer({})

                    const input = '<h1>This is a heading</h1><p>Hello World!</p>'
                    expect(() => { mr.render(input, 'foo') }).to.throw(TypeError, '"foo" is not a supported markup language!')
                    expect(() => { mr.render(input, 42) }).to.throw(TypeError, '"42" is not a supported markup language!')
                })
            })
        })
    })
})
