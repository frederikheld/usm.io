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
    let cardDirsRaw = await fs.readdir(this.cardsDir, { withFileTypes: true })

    // reduce to directories only:
    let cardDirs = cardDirsRaw
        .filter((entry) => {
            // console.log('entry', entry)
            return entry.isDirectory()
        })
        .map((dirent) => {
            return dirent.name
        })

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
