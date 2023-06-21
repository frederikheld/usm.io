# The User Story Map

If you don't know the method of User Story Mapping yet, I recommend that you read [Jeff Pattons publications](https://www.jpattonassociates.com/user-story-mapping/) before continuing.

To get started with _usm.io_ you only need to now the following: User Story Maps consist of _Acitivties_ (the green cards in the example) that are broken down into _Steps_ (blue). Each Step consists of _User Stories_ (yellow) that are grouped into _Releases_ (separated by horizontal lines).

Think of the cards as sticky notes on steroids. They can do a lot, but you decide how much info you want to put on them.

Each card can just have a title, but you can also create a full package that renders out as a little website.

This brings us to the two main features of _usm.io_:

1. it can render the User Story Map into a webpage (as shown in the image above)
2. it can render Cards into websites, which will automatically be linked from within the map

## Structuring the map

The json file that represents the User Story Map (we refer to it as `usm.json` in the documentation), has to be structured as follows:

```js
{
  "releases": [
    {
      "key": "mvp",
      "title": "MVP"
    },
    <...>
  ],
  "activities": [
    {
      "title": "Getting inspiration",
      "description": "Getting inspiration",
      "steps": [
        {
          "title": "Getting the idea",
          "description": "Getting the idea to watch a movie",
          "stories": [
            {
              "title": "Receive message from FilmFinder",
              "description": "Receive a message from FilmFinder about a movie on my watch list available to see",
              "inRelease": "mvp"
            },
            <...>
          ]
        },
        <...>
      ]
    },
    <...>
  ]
}
```

First you define the releases. Their order in the list defines their order in the map.

Below that you define Activities, Steps and Stories. Each with an title and/or description, which will be rendered as the card. Activities and Steps also have a list of their siblings, while Stories can be assigned to a specific release. Cards without a defined release will be put into the yet-to-be-defined future which is the bottom of the map.

### Writing cards

Simple cards can be described in `usm.json`. For more elaborate cards you can put them into a package that is linked in `usm.json`.

#### Simple Card Descriptions

A card can described directly in `usm.json`. This is the quickest way to begin with a map.

```js
{
  "title": "foo",
  "description": "bar",
  "stories": [
    {
      "title": "My first Story",
      "description": "This is my first Story. \o/ <( Yay! )"
    },
    <...>
  ]
}
```

If you do it this way, a Card can only have meta information like _title_ and _desciption_ but no further content.

#### Card Packages

If you want to create elaborate cards that are backed by some content, you can create card packages. Those are located in `input-dir/cards`. For each card you need to create a sub-folder that holds at least the following two files:

- `card.json`
- `index.[md|html]`

This card can be linked from `usm.json` via the `package` field.

```js
{
  "title": "foo",
  "description": "bar",
  "stories": [
    {
      "package": "my-first-story"
    },
    <...>
  ]
}
```

The Card description now has to be done in `card.json` in the respective package.

This is how `card.json` in the package `my-first-story` will look like:

```js
{
  "title": "My first Story",
  "description": "This is my first Story. \o/ <( Yay! )"
}
```

The advantage of this approach: You can now place content in this package that will be rendered into a small website that is linked from within the card. This helps you with keeping notes or add conceptual work to the card.

The entrypoint for this webiste is the `index` file which, depending on the markup language you are going to use, needs to have the appropriate file name extension.

#### Acceptance Criteria

Cards can have Acceptance Criteria (AC). AC are given as a list in the field _acceptanceCriteria_ and will be rendered as an unordered list below the description.

```javascript
{
  "title": "Bake apple pie for Jenny's party",
  "description": "AS Jenny who has invited you to her party I WANT you TO bring your famous apple pie SO THAT my guests can enjoy dessert",
  "acceptanceCriteria": [
    "Pie serves at least 4 people",
    "Pie does not contain raisins",
    "Pie is served on a platter",
    "Pie comes with a knife to cut it"
  ]
}
```

#### Tagging

Cards can be tagged. Tags are given as a list in the field _tags_ and will be rendered as classes into the card's container.

```javascript
{
  "title": "Another Story",
  "description": "Just another Story",
  "tags": ["needs-refinement", "stakeholder-x"]
}
```

This will render the card container as:

```html
<div class="card tag-needs-refinement tag-stakeholder-x">...</div>
```

You can use the classes for CSS styling or to manipulate the card via JavaScript.

### The directory tree

The simplest User Story Map is just an `usm.json` in `input-directory` and a `output-directory`. If you want to use the packages feature, you have to give your directory tree the following structure:

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

```

| reference                     | type      | description                                                                                                                                                                                                                                                                                                                                      | multiplicity | naming |
| ----------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------ |
| root                          | dir       | The root of your project                                                                                                                                                                                                                                                                                                                         |              |        |
| <nobr>input-directory</nobr>  | dir       | Will be referenced as `inputDir` in the context object                                                                                                                                                                                                                                                                                           | 1            | free   |
| <nobr>usm.json</nobr>         | file      | This file describes the User Story Map                                                                                                                                                                                                                                                                                                           | 1            | fixed  |
| cards                         | dir       | this is where usm.renderAllCards() will look for packages to render                                                                                                                                                                                                                                                                              | 0..1         | fixed  |
| <nobr>card-id-1</nobr>        | dir       | This name can be used in usm.json to reference the card. You can define as many cards as you want.                                                                                                                                                                                                                                               | 0..\*        | free   |
| <nobr>card.json</nobr>        | file      | This file holds the card's meta data. It follows the same rules as usm.json. Fields in usm.json will overwrite fields in card.json.                                                                                                                                                                                                              | 1            | fixed  |
| <nobr>index.[md\|html]</nobr> | file      | This file is the root of the contents of the card. The name is fixed but you can choose between the available file type extensions.                                                                                                                                                                                                              | 1            | fixed  |
| <..>                          | file\|dir | Besides the mandatory index file, you can have as many files as you need to describe the card. Graphics and other assets that can be linked are allowed as well.                                                                                                                                                                                 | 0..\*        | fixed  |
| output-directory              | dir       | Will be referenced as `outputDir` in the context object. `usm.renderMap()` will render `usm.json` into `index.html` in the `output-directory`. `usm.RenderCards()` will write the Card packages to the same file system tree as in `inputDir`. The naming will be the same except for the file name extension of those files that were rendered. | 1            | free   |

### Supported markup languages

Pages that are written in one of the supported markup languages will be rendered into websites. Supported markup lanuages are:

| Language | Extension | Specification                                  | Processor                                                 |
| -------- | --------- | ---------------------------------------------- | --------------------------------------------------------- |
| Markdown | .md       | [CommonMark](https://commonmark.org/)          | [markdown-it](https://github.com/markdown-it/markdown-it) |
| HTML     | .html     | [HTML5](https://dev.w3.org/html5/html-author/) | no processing, will be used "as is"                       |

You can add additional pages and ressources as you like. The directory tree in the target directroy will be the same as in your package.

Links to other markup files will be converted automatically into links to the generated html file.

Everything that is not one of the supported markup languages will just be copied & pasted into the target directory.

#### Markdown

Markdown files need to comply to the [CommonMark](https://commonmark.org/) specification to be processed correctly.

#### HTML

HTML files should only contain what can be put into the `<body>` of a HTML document. The markup needs to comply to the [HTML5](https://dev.w3.org/html5/html-author/) standard.

#### Anything else

Besides the markup languages that will be rendered into websites you can put any filetype into the sources that can be served via a website. Don't forget to embed or link it somewhere, otherwise it's just dead weight ;-)

## Learn more

To understand how the User Story Map and the cards packages can be done, look into the [example](../example/). It shows all possible approaches.

For more detailed information on the features of _usm.io_ you can also read the tests in [src/usm/tests](../src/usm/tests/) and [src/render-engine/tests](../src/render-engine/tests/). [usm/tests/usm.test.js](usm/tests/usm.test.js) is good for a start.
