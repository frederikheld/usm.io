# usm.io

## What is this?

This module can render a User Story Map and all related cards from a structured data and markup representation into an interactive website.

Data representation (meta information) is done with JSON, for content description the supported markup languages currently are Markdown and HTML.

## Installation

    $ npm install --save usm.io

## How to use

### The User Story Map

The Usm has two main features:

1. it can render the User Story Map into a webpage
1. it can render all Card packages into websites

It also generates the links from the USM to the Card websites so that the user can seamlessly jump from a card in the User Story Map into the websites that describe the respective Card.

The expected directory tree is as follows:

```
[d] root
 ├─ [d] input-directory
 |   ├─ [f] usm.json
 |   └─ [d] cards
 |       ├─ [d] card-id-1
 |       |   ├─ [f] card.json
 |       |   ├─ [f] index.md
 |       |   └─ [d|f] <...>
 |       └─ [d] <...>
 └─ [d] output-directory
     ├─ [f] index.html
     └─ [d] cards
         ├─ [d] card-id-1
         |   ├─ [f] index.html
         |   └─ [d|f] <...>
         └─ [d] <...>

```

| reference                     | type      | description                                                                                                                                                                                                                                                                                                                                      | multiplicity | naming |
| ----------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------ |
| root                          | dir       | The root of your project                                                                                                                                                                                                                                                                                                                         |              |        |
| <nobr>input-directory</nobr>  | dir       | Will be referenced as `inputDir` in the context object                                                                                                                                                                                                                                                                                           | 1            | free   |
| <nobr>usm.json</nobr>         | file      | This file describes the User Story Map                                                                                                                                                                                                                                                                                                           | 1            | fixed  |
| cards                         | dir       | this is where usm.renderAllCards() will look for packages to render                                                                                                                                                                                                                                                                              | 1            | fixed  |
| <nobr>card-id-1</nobr>        | dir       | This name can be used in usm.json to reference the card. You can define as many cards as you want.                                                                                                                                                                                                                                               | 0..\*        | free   |
| <nobr>card.json</nobr>        | file      | This file holds the card's meta data. It follows the same rules as usm.json. Fields in usm.json will overwrite fields in card.json.                                                                                                                                                                                                              | 1            | fixed  |
| <nobr>index.[md\|html]</nobr> | file      | This file is the root of the contents of the card. The name is fixed but you can choose between the available file type extensions.                                                                                                                                                                                                              | 1            | fixed  |
| <..>                          | file\|dir | Besides the mandatory index file, you can have as many files as you need to describe the card. Graphics and other assets that can be linked are allowed as well.                                                                                                                                                                                 | 0..\*        | fixed  |
| output-directory              | dir       | Will be referenced as `outputDir` in the context object. `usm.renderMap()` will render `usm.json` into `index.html` in the `output-directory`. `usm.RenderCards()` will write the Card packages to the same file system tree as in `inputDir`. The naming will be the same except for the file name extension of those files that were rendered. | 1            | free   |

The entry point for your User Story Map is the Usm object. It expects a context object as parameter:

```javascript
const Usm = require("usm.io");
const path = require("path");

const context = {
  inputDir: path.join(__dirname, "input"),
  outputDir: path.join(__dirname, "output"),
  cardsWebroot: "cards"
};
const usm = new Usm(context);
```

The context object can take the following parameters:
| parameter | type | description | mandatory |
| - | - | - | - |
| `inputDir` | path in file system | Where to look for sources | yes |
| `outputDir` | path in file system | where to put rendered results | yes |
| `cardsWebroot` | weblink | This can be an absolute or relative link to the cards, which is used for the link in usm cards | yes |

> Note: Right now there's no sanity check if the data given in the context object is correct!

For each rendering feature there's an asynchronous function that takes the input from the `inputDirectory` and writes the rendered output to the `outputDirectory`:

```javascript
await usm.renderMap();
await usm.renderCards();
```

### Cards

Each item on the map, Activities, Steps and Stories, is represented as a Card.

#### Simple Card Descriptions

A card can described directly in `usm.json`. This is the quickest way to begin with a map.

```javascript
stories: [
  {
    title: "My first Story",
    description: "This is my first Story. o/ <( Yay! )"
  }
];
```

If you do it this way, a Card can only have meta information like _title_ and _desciption_ but no further content.

#### Card Packages

If you want to create elaborate cards that are backed by some content, you can create card packages. Those are located in `input-dir/cards`. For each card you need to create a sub-folder that has at least the following two files:

- `card.json`
- `index.[md|html]`

This card can be linked from `usm.json` via the _package_ field.

```javascript
stories: [
  {
    package: "my-first-story"
  }
];
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

### Supported markup languages

Supported markup languages are right now:

| Language | Extension | Processor                                                 |
| -------- | --------- | --------------------------------------------------------- |
| Markdown | .md       | [markdown-it](https://github.com/markdown-it/markdown-it) |
| HTML     | .html     | \<not being processed\>                                   |

Starting from `index`, you can add additional pages and ressources as you like. Everything that is not supported as a markdown language will just copied & pasted into the target directory. The directory tree in the target directroy will be the same as in your package. Links to other markup files will be converted automatically into links to the generated html file. This way you are free to add content as you like.

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
