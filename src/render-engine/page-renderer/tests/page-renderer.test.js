'use strict'

const chai = require('chai')
chai.should()

const fs = require('fs').promises

const path = require('path')

const PageRenderer = require('../index.js')

describe('PageRenderer', () => {
    describe('render()', () => {
        context('no "renderOptions" given in constructor', () => {
            it('returns the input without any modifications', async () => {
                const pr = new PageRenderer()

                const input = '# Heading\n\nParagraph'

                const result = await pr.render(input)

                result.should.equal(input)
            })
        })

        context('filetype given with "pageMeta" can\'t be rendered as a website', () => {
            it('throws a TypeError', async () => {
                const pr = new PageRenderer()

                const input = 'Some dummy input'

                const pageMeta = {
                    fileExtension: 'jpg'
                }

                await pr.render(input, pageMeta).should.be.rejectedWith(TypeError)
            })
        })

        context('"renderOptions" contains field "header"', () => {
            it('throws ans error if field "header.template" is missing', async () => {
                const renderOptions = {
                    header: {}
                }
                const pr = new PageRenderer(renderOptions)

                const input = '# Heading\n\nParagraph'

                await pr.render(input).should.be.rejectedWith(ReferenceError, '"template" missing in "header"!')
            })

            it('replaces mustache tags with value of key with same name from "header.props"', async () => {
                const renderOptions = {
                    header: {
                        template: path.join(__dirname, 'mock-data', 'input', 'template-header.html'),
                        props: {
                            'page-title': 'Awesome Page',
                            hello: 'Hello World!'
                        }
                    }
                }
                const pr = new PageRenderer(renderOptions)

                const input = ''
                const expectedOutput = await fs.readFile(path.join(__dirname, 'mock-data', 'expected-output', 'header.html'), { encoding: 'utf-8' })

                const output = await pr.render(input)

                output.should.equal(expectedOutput)
            })
        })

        context('"renderOptions" contains field "footer"', () => {
            it('throws ans error if field "footer.template" is missing', async () => {
                const renderOptions = {
                    footer: {}
                }
                const pr = new PageRenderer(renderOptions)

                const input = '# Heading\n\nParagraph'

                await pr.render(input).should.be.rejectedWith(ReferenceError, '"template" missing in "footer"!')
            })

            it('replaces mustache tags with value of key with same name from "footer.props"', async () => {
                const renderOptions = {
                    footer: {
                        template: path.join(__dirname, 'mock-data', 'input', 'template-footer.html'),
                        props: {
                            'info-in-footer': 'Some info in footer'
                        }
                    }
                }
                const pr = new PageRenderer(renderOptions)

                const input = ''
                const expectedOutput = await fs.readFile(path.join(__dirname, 'mock-data', 'expected-output', 'footer.html'), { encoding: 'utf-8' })

                const output = await pr.render(input)

                output.should.equal(expectedOutput)
            })
        })
    })
})
