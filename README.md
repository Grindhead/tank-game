## Installation instructions

1. **Install Node.js:** You can download and install Node.js from the [official website](https://nodejs.org/).

2. **Install TexturePackerCLI:** You can find installation instructions for TexturePackerCLI on their [official website](https://www.codeandweb.com/texturepacker/download).

3. **Install pnpm:** run `npm install -g pnpm`

4. **install dependancies:** run `pnpm install`

5. **run game:** run `pnpm start`

# pnpm start - runs the app in dev mode and also runs `yarn docs`

# pnpm build - generates a production build to the dist directory

# pnpm lint - runs a linter over the project

# pnpm docs - generates documentation at localhost:8080/docs

# pnpm images - generates texture atlases and compresses them using TexturePackerCLI

# pnpm changeset - creates a .md file to document semver changes

# pnpm create-level - create a new level


## Dashboard task verification

The dev path lacked an atlas, resource imports had wrong case, generated tile values disagreed with rendering, and fire/scale state survived lifecycle changes. Builds generate the atlas, tile values align, focus/exit clear fire, and scaling applies at the root.

Production build, three regressions for controls/resize/tile generation, and Chromium/Firefox font-outage plus asset-failure/retry checks passed.

Webpack now shares one Pixi entry point across the CommonJS app and ESM toolkit, removing a real renderer class mismatch. The toolkit published2.0.38 API is retained.
