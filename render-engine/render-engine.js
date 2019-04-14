'use strict'

module.exports = renderEngine

const fs = require('fs-extra')
const path = require('path')

const CardRenderer = require('./card-renderer')

function renderEngine (cardsDir, outputDir) {
    this.cardsDir = cardsDir
    this.outputDir = outputDir
}

renderEngine.prototype.renderAllCards = async function () {
    // find all cards in input directory:
    let cardDirs = await fs.readdir(this.cardsDir)

    // prepare paths for each card:
    let allCards = cardDirs.map((card) => {
        return {
            cardDir: path.join(this.cardsDir, card),
            outputDir: path.join(this.outputDir, card)
        }
    }, this)

    // render each card:
    const promises = allCards.map(async (card) => {
        const re = new CardRenderer(card.cardDir, card.outputDir)
        await re.render()
    }, this)
    await Promise.all(promises)
}
