'use strict'

const path = require('path')

const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const fs = require('fs').promises

const helpers = require('./helpers')

const Usm = require('../usm')

describe('usm', function () {
    describe('the constructor Usm(jsonUsm)', function () {
        it('expects a JSON object', function () {
            expect(function () {
                new Usm({})
            }).to.not.throw()
        })

        it('throws an error if the passed data is not a json object', function () {
            expect(function () {
                new Usm('This is not an object')
            }).to.throw(TypeError)
            expect(function () {
                new Usm([])
            }).to.throw(TypeError)
        })

        it('throws an error if no data is passed at all', function () {
            expect(function () {
                new Usm()
            }).to.throw(ReferenceError)
        })
    })

    describe('Usm.prototype.render(config)', function () {
        // context('stored json object is invalid', function () {

        // })

        context('the stored json object is valid', function () {
            context('with standard settings for rendering', function () {
                it('renders an empty Usm container', async function () {
                    const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                    const jsonUsm = JSON.parse(rawUsm)

                    const usm = new Usm(jsonUsm)

                    let htmlRendered = usm.render()

                    let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                    htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                    helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                })
            })
        })

        it('renders an empty Activities container', async function () {
            const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-activities-empty.json'))
            const jsonUsm = JSON.parse(rawUsm)

            const usm = new Usm(jsonUsm)

            let htmlRendered = usm.render()

            let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-activities-empty.html'), 'utf8')
            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

            helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
        })

        it('can take a configuration object as optional parameter', function () {
            context('the passed parameter is an object', function () {
                describe('the configuration object', function () {
                    describe('field "css"', function () {
                        context('field "css" is given and contains a string', function () {
                            it('renders a <link rel="stylesheet" /> tag with the given string as the value of "href"', async function () {
                                const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                                const jsonUsm = JSON.parse(rawUsm)

                                const usm = new Usm(jsonUsm)
                                let config = {
                                    css: './path/to/stylesheet.css'
                                }
                                let htmlRendered = usm.render(config)

                                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-stylesheet.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                            })
                        })

                        context('field "css" is defined but doesn\'t contain a string', function () {
                            it('throws a TypeError', async function () {
                                const usm = new Usm({})

                                let config = {
                                    css: 5
                                }

                                expect(function () {
                                    usm.render(config)
                                }).to.throw(TypeError)
                            })
                        })

                        context('field "css" is not defined', function () {
                            it('doesn\'t render a <link rel="stylesheet" /> tag', async function () {
                                const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                                const jsonUsm = JSON.parse(rawUsm)
                                const usm = new Usm(jsonUsm)

                                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                                let htmlRendered = usm.render({})

                                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                            })
                        })
                    })

                    describe('field "js"', function () {
                        context('field "js" is given and contains a string', function () {
                            it('renders a <script /> tag with the given string as the value of "src"', async function () {
                                const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                                const jsonUsm = JSON.parse(rawUsm)

                                const usm = new Usm(jsonUsm)
                                let config = {
                                    js: './path/to/script.js'
                                }
                                let htmlRendered = usm.render(config)

                                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-with-script.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                            })
                        })

                        context('field "js" is defined but doesn\'t contain a string', function () {
                            it('throws a TypeError', async function () {
                                const usm = new Usm({})

                                let config = {
                                    js: 5
                                }

                                expect(function () {
                                    usm.render(config)
                                }).to.throw(TypeError)
                            })
                        })

                        context('field "js" is not defined', function () {
                            it('doesn\'t render a <script /> tag', async function () {
                                const rawUsm = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.json'))
                                const jsonUsm = JSON.parse(rawUsm)
                                const usm = new Usm(jsonUsm)

                                let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'), 'utf8')
                                htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'), 'utf8')

                                let htmlRendered = usm.render({})

                                helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                            })
                        })
                    })

                    describe('the field "timeline"', function () {
                        it('has to be boolean', function () {
                            const usm = new Usm({})

                            expect(function () {
                                usm.render({ 'timeline': true })
                            }).to.not.throw()

                            expect(function () {
                                usm.render({ 'timeline': 'blah' })
                            }).to.throw()

                            expect(function () {
                                usm.render({ 'timeline': [] })
                            }).to.throw()
                        })

                        it('doesn\'t render an arrow if value is "false"', async function () {
                            const usm = new Usm({})

                            const config = {
                                timeline: false
                            }

                            let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'))

                            let htmlRendered = usm.render(config)

                            helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                        })

                        it('renders an arrow if value is "true"', async function () {
                            const usm = new Usm({})

                            const config = {
                                timeline: true
                            }

                            let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-with-timeline.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'))

                            let htmlRendered = usm.render(config)

                            helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                        })

                        it('defaults to "false" if not given', async function () {
                            const usm = new Usm({})

                            let htmlExpected = await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-header-standard.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-empty.html'))
                            htmlExpected += await fs.readFile(path.join(__dirname, 'mock-data', 'mock-usm-footer-standard.html'))

                            let htmlRendered = usm.render()

                            helpers.stripWhitespaces(htmlRendered).should.equal(helpers.stripWhitespaces(htmlExpected))
                        })
                    })
                })
            })

            context('the passed parameter is not an object', function () {
                it('throws a TypeError', function () {
                    const usm = new Usm({})

                    let config = 3

                    expect(function () {
                        usm.render(config)
                    }).to.throw(TypeError)
                })
            })
        })
    })
})
