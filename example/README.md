# usm.io example


> Please note that the example does not install the generator from _npm_ (like you would do it) but imports it directly from this repository. This allows to quickly test changes in development.

## Pre-requisites

This is a _NodeJS_ project. You need a working [_NodeJS_](https://nodejs.org/) environment with _npm_ to run the example. Check your versions of _NodeJS_ and _npm_ with:

```sh
$ node -v
$ npm -v
```

NodeJS 18.x is recommended.

## Install dependencies

To get the example started, you have to install the dependencies in the root of this repository:

```sh
$ npm install
```

## Run the generator

Then navigate into the `example` directory and run the generator:

```sh
$ cd example
$ node generator.js
```

This will generate the user story map as web pages in [example/web](example/web). Open [example/output/index.html](example/output/index.html) in your favorite web browser to see the result.

You can now make changes to [example/input/usm.json](./example/input/usm.json) or to one of the cards in [example/input/cards](./example/input/cards), run `$ node generator.js` again, refresh your browser and see how the visualization has changed.

## Re-use the example

The `usm.io` package will only render the html files. It can link styles and scripts in the rendered html, but you need to provide your own styles and scripts to bring it to life.

To get your project started quickly, you can use `web/scripts.js` and `web/styles.css` from this example.

## Sources

This example implements Jeff Patton's User Story Mapping example "Film Finder". [You'll find the template files here]( https://www.dropbox.com/sh/naxyjgn7wwvtmmz/AAAEGR4Lav8rz2eTbyAJGgUia?dl=0).