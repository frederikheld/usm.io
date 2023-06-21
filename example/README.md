# usm.io example

This example shows how usm.io can be used.

## Run the example

Run

```sh
$ node generator.js
```

to render `input/usm.json` into `web/index.html`. Open the html file in your browser to see the result.

Edit the json file, run the generator again and refresh your browser to see how changes in the json file are rendered to html.

## Re-use

`usm.io` will only render the html file. It can link styles and scripts in the rendered html, but you need to provide your own styles and scripts to bring it to life.

To get your project started quickly, I recommend to to use `web/scripts.js` and `web/styles.css` from this example.

## Sources

This example implements Jeff Patton's User Story Mapping example "Film Finder". [You'll find the template files here]( https://www.dropbox.com/sh/naxyjgn7wwvtmmz/AAAEGR4Lav8rz2eTbyAJGgUia?dl=0).