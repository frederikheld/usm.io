# usm.io

## What is this?
This module can represent an User Story Map.

It takes the data representation of an User Story Map as input and returns the visual representation of the said User Story map as output.

### Supported input types
* JSON

### Supported output types
* HTML

### Installation

    $ npm install --save usm.io

### How to use

This modules comes with an [example](example) on how usm.io can be used. The example includes stylesheets and scripts that bring the generated html file to life. They are a good starter for your own project.

Make some changes in [example/input/usm-example.json](example/input/usm-example.json), then re-generate the html file in [example/web](example/web) by running

    $ cd example
    $ node generator.js

### Docs

For more detailled information on the features of usm.io, read the tests. Start with [usm/tests/usm.test.js](usm/tests/usm.test.js).

## Known Issues

* Paths specified in json files have to be _relative to the script that is processing the json file_, not to the file itself. This is counter-intuitive and should be fixed soon.
* There's a lot of duplication in all the modules that assemble the usm module. There should be one generic module for containers and one for cards. All the specific modules should extend one of those two basic modules.