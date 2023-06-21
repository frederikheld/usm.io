# Create a new npm release

> This is a documentation for maintenance and should not be relevant for you if you are not a maintainer. It might be informative for your own project though.

Creating a release includes pushing a new [package version to NPM](https://www.npmjs.com/package/usm.io) and also providing a new [release via GitHub](https://github.com/frederikheld/usm.io/releases).

## Quality Assurance

Make sure that the current state of the package is functional!

Run the following steps and make sure that they do not throw any errors:

1. Install the dependencies with `$ npm install`
1. Check for vulnerabilities with `$ npm audit`
1. Run all automated tests with `$ npm run test`
1. Check test coverage with `$ npm run coverage`
1. Build an user story map throught the  [example](../example/)
    1. `$ cd example`
    1. `$ node generator.js`
    1. Open [example/web/index.html`](../example/web/index.html) in your web browser
    1. Check the browser console for errors
    1. Check visually if everything works fine
1. Make changes to the files in [example/input/](../example/input/) and repeat the above steps to check if the changes have been rendered

If any of the above steps fail, fix the issue and start again from 1.

## Create Release

Follow these steps to create a new release:

1. Decide for the next version number according to [Semantic Versioning principles](https://semver.org/). We'll pretend it is `3.2.1` in this guideline.
1. Create a new branch for the release named `release/v3.2.1`.
1. Change the version number in [`package.json`](../package.json) to `3.2.1`
1. Run `$ npm install` to have the version number carried over to [package-lock.json](../package-lock.json)
1. Add release notes to [CHANGELOG.md](../CHANGELOG.md) according to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
    1. Create a new section for the release atop of the existing sections
    1. Go through all Pull Requests that went into this release and copy the relevant information into the right sub-section of the new release
1. Commit everything and push to GitHub.
1. Create a Pull Request and merge it to `master`.

## Publish Package on NPM

Follow these steps to publish the new release on npm:

1. Login to npm with `$ npm login` and follow the instructions to log in
2. Publish release with `$ npm publish`. Wait for the upload to be finished and follow the instructions to provide your OTP

## Publish Realease on GitHub

Follow these steps to publish the new release on GitHub:

1. Open the [Releases](https://github.com/frederikheld/usm.io/releases) section in the repo
1. Click on "Draft a new release"
1. Name it `v3.2.1`
1. Create a new Tag `v3.2.1.` and assign it to the release
1. Copy the recently added section from the [CHANGELOG.md](../CHANGELOG.md) into the description field. Adapt the formatting as GitHub won't interpret markdown in release descriptions.
1. Check "set as the latest release"
1. Click "Publish release"
