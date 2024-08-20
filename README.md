# My Portfolio - Built with Astro 

## 🚀 Project Structure

Inside of this Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── img/
│   ├── layouts/
│   └── pages/
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

The `src/data` is where the remote data gathering functions are placed.

The images in `src/img` will be transformed by the Astro Image component.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

This project uses `pnpm` for package management.
Follow the [pnpm installation instructions](https://pnpm.io/installation)

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |


## 👀 Want to learn more about Astro?

Feel free to check [Astro documentation](https://docs.astro.build) or jump into the Astro [Discord server](https://astro.build/chat).
