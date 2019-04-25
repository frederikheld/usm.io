# usm.io

## What is this?
This module can render a User Story Map and all related cards from a structured data and markup representation into an interactive website.

Data representation (meta information) is done with JSON, for content description the supported markup languages currently are Markdown and HTML.

### Installation

    $ npm install --save usm.io

### How to use

The entry point for your User Story Map is the Usm object. It expects a context object as parameter, that contains all information about where to look for sources and where to put the rendered output:

```javascript
const path = require('path')

const context = {
    inputDir: path.join(__dirname, 'root', 'input-directory'),
    outputDir: path.join(__dirname, 'root', 'output-directory')
}
const usm = new Usm(context)
```

The Usm has two main features:
1. it can render the User Story Map in an HTML page
1. it can render all Card packages into websites.

It also generates the links from the USM to the Card websites so that the user can seamlessly jump from a card in the User Story Map into the websites that describe the respective Card.

The expected directory tree is as follows:

```
 .
 ├─ [folder] root
     ├─ [folder] input-directory (variable name; will be referenced in inputDir in the context object)
     ├─ [file] usm.json (fixed name; this is where you describe the User Story Map)
     └─ [folder] cards (fixed name; this is where usm.renderAllCards() will look for packages to render)
         ├─ [folder] card-id-1 (variable name; this the name you use in usm.json to reference the card)
             ├─ [file] card.json (fixed name)
             ├─ [file] index.md (fixed name)
             └─ <...> optional additional files and directories that are linked from index.md
         └─ <...> you can put here as many cards as you like
 └─ [folder] output-directory (variable name; will be referenced in outputDir in the context object)
     └─ <...> usm.RenderAllCards() will create the same file system tree as in inputDir with the rendered Card packages
```

For each rendering feature there's an asynchrnous function:
```javascript
await usm.renderUsm()
await usm.renderAllCards()
```



~~This modules comes with an [example](example) on how usm.io can be used. The example includes stylesheets and scripts that bring the generated html file to life. They are a good starter for your own project.~~

~~Make some changes in [example/input/usm-example.json](example/input/usm-example.json), then re-generate the html file in [example/web](example/web) by running~~

    $ cd example
    $ node generator.js

### Docs

For more detailled information on the features of usm.io, read the tests. Start with [usm/tests/usm.test.js](usm/tests/usm.test.js).

## Known Issues

* Paths specified in json files have to be _relative to the script that is processing the json file_, not to the file itself. This is counter-intuitive and should be fixed soon.
* There's a lot of duplication in all the modules that assemble the usm module. There should be one generic module for containers and one for cards. All the specific modules should extend one of those two basic modules.