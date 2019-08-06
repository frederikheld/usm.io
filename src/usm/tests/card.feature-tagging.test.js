'use strict'

const chai = require('chai')
chai.should()
const expect = chai.expect

const Card = require('../card')

describe('card feature "tagging"', () => {
    context('Cards in usm.json', () => {
        it('can have a field "tags"', async () => {
            const card = new Card({
                title: 'Foo',
                tags: []
            }, {})

            expect(() => { card.render() }).to.throw
        })

        it('throws a TypeError, if value of "tags" is not a list', () => {
            expect(() => {
                new Card({
                    title: 'Foo',
                    tags: 'not-a-list'
                }, {})
            }).to.throw(TypeError, 'Value of field "tags" has to be an array!')

            expect(() => {
                new Card({
                    title: 'Foo',
                    tags: 42
                }, {})
            }).to.throw(TypeError, 'Value of field "tags" has to be an array!')
        })
    })

    context('the card as rendered in the map', () => {
        it('renders a class "tag-<tag-name>" for each tag in the list into the card\'s div', () => {
            const card = new Card({
                title: 'Foo',
                tags: ['bar', 'baz']
            }, {})

            const htmlRendered = card.render()
            htmlRendered.should.match(/<div class="card tag-bar tag-baz">/)
        })
    })
})
