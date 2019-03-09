# usm.io

## What is this?
This module can represent an User Story Map.

It takes the data representation of an User Story Map as input and can return the visual representation of the said User Story map as output.

### Supported input types
* JSON
* ~~XML~~

### Supported output types
* HTML
* (SVG)

### Installation

    npm install --save usm.io

### Usage

    const Usm = require('usm.io')

    let jsonInput = { /* json representation of usm */ }
    const usm = new Usm(jsonInput)
    
    let htmlOutput = usm.render()
    console.log(htmlOutput)
