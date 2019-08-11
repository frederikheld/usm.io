'use strict'

const helpers = require('./helpers')

const chai = require('chai')
chai.should()
const expect = chai.expect

const Card = require('../card')

describe('Card feature "Acceptance Criteria"', () => {
    context('Cards in usm.json', () => {
        it('can have a field "acceptanceCriteria"', async () => {
            const card = new Card({
                title: 'Foo',
                acceptanceCriteria: []
            }, {})

            expect(() => { card.render() }).to.throw
        })

        it('throws a TypeError, if value of "acceptanceCriteria" is not a list', () => {
            expect(() => {
                new Card({
                    title: 'Foo',
                    acceptanceCriteria: 'not-a-list'
                }, {})
            }).to.throw(TypeError, 'Value of field "acceptanceCriteria" has to be an array!')

            expect(() => {
                new Card({
                    title: 'Foo',
                    acceptanceCriteria: 42
                }, {})
            }).to.throw(TypeError, 'Value of field "acceptanceCriteria" has to be an array!')
        })
    })

    context('the card as rendered in the map', () => {
        it('renders the Acceptance Criteria as container with a heading and an ordered list into the card', () => {
            const card = new Card({
                title: 'Foo',
                acceptanceCriteria: ['bar', 'baz']
            }, {})

            const htmlRendered = card.render()
            helpers.stripWhitespaces(htmlRendered).should.contain('<div class="acceptance-criteria"><h2>Acceptance Criteria</h2><ol><li>bar</li><li>baz</li></ol></div>')

            // cross-check:
            const card2 = new Card({
                title: 'Foo'
            }, {})

            const htmlRendered2 = card2.render()
            helpers.stripWhitespaces(htmlRendered2).should.not.contain('class="acceptance-criteria"')
        })

        it('the list of Acceptance Criteria is rendered below the Description', () => {
            const card = new Card({
                title: 'Foo',
                description: 'Bar',
                acceptanceCriteria: ['this', 'that']
            }, {})

            const htmlRendered = card.render()
            helpers.stripWhitespaces(htmlRendered).should.match(/(.*)description(.*)acceptance-criteria(.*)/)
        })
    })
})
