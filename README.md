## Installation instructions

1. **Install Node.js:** You can download and install Node.js from the [official website](https://nodejs.org/).

2. **Install TexturePackerCLI:** You can find installation instructions for TexturePackerCLI on their [official website](https://www.codeandweb.com/texturepacker/download).

3. **Install pnpm:** run `npm install -g pnpm`

4. **install dependancies:** run `pnpm install`

5. **run game:** run `pnpm start` (this first generates `dist/atlas.json` and `dist/atlas.png` with TexturePackerCLI, so step 2 is required)

# pnpm start - generates the texture atlas (`pnpm atlas`) and runs the app in dev mode

# pnpm build - generates a production build to the dist directory

# pnpm lint - runs a linter over the project

# pnpm docs - generates documentation at localhost:8080/docs

# pnpm atlas - generates the texture atlas into dist without compressing it

# pnpm images - generates texture atlases and compresses them using TexturePackerCLI

# pnpm changeset - creates a .md file to document semver changes

# pnpm create-level - create a new level (tile values: 0 = empty, 1 = indestructible wall, 2 = destructible hay; see `src/Resources/JSON/tileTypes.json`)
