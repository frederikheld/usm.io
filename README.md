# usm.io

## What is this?
This module can render a User Story Map and all related cards from a structured data and markup representation into an interactive website.

Data representation (meta information) is done with JSON, for content description the supported markup languages currently are Markdown and HTML.

## Installation

    $ npm install --save usm.io

## How to use

### The User Story Map

The entry point for your User Story Map is the Usm object. It expects a context object as parameter, that contains all information about where to look for sources and where to put the rendered output:

```javascript
const Usm = require('usm.io')
const path = require('path')

const context = {
    inputDir: path.join(__dirname, 'input'),
    outputDir: path.join(__dirname, 'output')
}
const usm = new Usm(context)
```

The Usm has two main features:
1. it can render the User Story Map into a webpage
1. it can render all Card packages into websites

It also generates the links from the USM to the Card websites so that the user can seamlessly jump from a card in the User Story Map into the websites that describe the respective Card.

The expected directory tree is as follows:

```
 .
 └─ [d] root
     ├─ [d] input-directory (mandatory, variable name; will be referenced in inputDir in the context object)
     |   ├─ [f] usm.json (mandatory, fixed name; this is where you describe the User Story Map)
     |   └─ [d] cards (mandatory, fixed-name; this is where usm.renderAllCards() will look for packages to render)
     |       ├─ [d] card-id-1 (optional, variable name; this the name you use in usm.json to reference the card)
     |       |   ├─ [f] card.json (mandatory, fixed name)
     |       |   ├─ [f] index.md (madatory, fixed name)
     |       |   └─ <...> optional additional files and directories that are linked from index.md
     |       └─ <...> you can put here as many cards as you like
     └─ [d] output-directory (mandatory, variable name; will be referenced in outputDir in the context object)
         └─ <...> usm.RenderAllCards() will create the same file system tree as in inputDir with the rendered Card packages
```

For each rendering feature there's an asynchronous function:
```javascript
await usm.renderMap()
await usm.renderCards()
```

### Cards

Each item on the map, Activities, Steps and Stories, is represented as a Card.

#### Simple Card Descriptions

A card can described directly in `usm.json`. This is the quickest way to begin with a map.

```javascript
stories: [
    {
        title: 'My first Story',
        description: 'This is my first Story. \o/ <( Yay! )'
    }
]
```

If you do it this way, a Card can only have meta information like _title_ and _desciption_ but no further content.

#### Card Packages

If you want to create elaborate cards that are backed by some content, you can create card packages. Those are located in `input-dir/cards`. For each card you need to create a sub-folder that has at least the following two files:

* `card.json`
* `index.[md|html]`

This card can be linked from `usm.json` via the _package_ field.

```javascript
stories: [
    {
        package: 'my-first-story'
    }
]
```

The Card description now has to be done in `card.json` in the respective package.

This is how `card.json` in the package `my-first-story` will look like:

```javascript
{
    title: 'My first Story',
    description: 'This is my first Story. \o/ <( Yay! )'
}
```

The advantage of this approach: You can now place content in this package that will be rendered into a small website that is from within the card. This helps with keeping notes or add conceptual work to the card.

The entrypoint for this webiste is the `index` file which, depending on the markup language you are going to use, needs to have the appropriate file name extension.

Supported markup languages are right now:

| Language | Extension | Processor |
| - | - | - |
| Markdown | .md | [markdown-it](https://github.com/markdown-it/markdown-it) |
| HTML | .html | \<not being processed\> |

Starting from `index`, you can add additional pages and ressources as you would like. Everything that is not supported as a markdown language will just copy & pasted into the target directory. The directory tree in the target directroy will be the same as in your package. Links to other markup files will automatically converted into links to the generated html file. This way you are free to add content as you like.

## Example

This modules comes with an [example](example) on how usm.io can be used. The example includes stylesheets and scripts that bring the generated html map to life. They are a good starter for your own project.

Make some changes in [example/input/usm-example.json](example/input/usm-example.json) or one of the packages, then re-generate the html file in [example/web](example/web) by running

    $ cd example
    $ node generator.js

### Docs

For more detailled information on the features of usm.io read the tests. [usm/tests/usm.test.js](usm/tests/usm.test.js) is good for a start.

## Next Steps in Development

### Features

- [ ] Implement releases in map

### Styling
- [ ] Stylesheet for rendered packages
- [ ] Package title in title of web page (at least for md which doesn't allow to define meta data)
- [ ] Common footer & header for packages and map. Package header should have a link back to the USM.

### Under the hood

- [ ] Improve test coverage (a lot of cases aren't testet yet) 
- [ ] Clean up test suites (make structure more suitable as a documentation)
- [ ] Remove duplication: There's a lot of duplication in all the modules. There should be one generic module for containers and one for card representations. All the specific modules should extend one of those two basic modules.
- [x] Remove unused mocks
