# React Router + Hono Monorepo Template

A bleeding edge React Router v7 monorepo setup with the bells and whistles required to get a project underway with all the latest toys in late 2024.

### Setup

```shell
git clone https://github.com/barclayd/react-router-trpc-hono-bun-template
cd react-router-trpc-hono-bun-template
bun install
```

### Structure

```
.
├── apps/
│   ├── web/                 # React Router frontend
│   │   ├── app/            # Routes and components
│   │   └── package.json    # React 19, React Router, tRPC client
│   │
│   └── server/             # Hono backend
│       ├── src/            # API routes and business logic
│       └── package.json    # Hono, tRPC server
│
├── package.json            # Workspace dependencies
└── turbo.json             # Turborepo config
```

The monorepo is powered by Turborepo and Bun workspaces, consisting of:
- `apps/web`: React Router frontend application
- `apps/server`: Hono backend server

### Technologies

| Category            | Technology                                                                                                                                                                                                                                                      | Version       |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| Build system        | [<img src="https://user-images.githubusercontent.com/4060187/196936104-5797972c-ab10-4834-bd61-0d1e5f442c9c.png" width="40" alt="Turborepo">](https://turbo.build/repo) [Turborepo](https://turbo.build/repo)                                                   | 2.3.3         |
| Workspace/runtime   | [<img src="https://bun.sh/logo.svg" width="40" alt="Bun">](https://bun.sh) [Bun](https://bun.sh)                                                                                                                                                                | 1.1.38        |
| Linting             | [<img src="https://avatars.githubusercontent.com/u/140182603?s=200&v=4" width="40" alt="Biome">](https://biomejs.dev/) [Biome](https://biomejs.dev/)                                                                                                            | 1.9.4         |
| Language            | [<img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" width="40" alt="TypeScript">](https://www.typescriptlang.org/) [TypeScript](https://www.typescriptlang.org/)             | 5.5.4         |
| Server              | [<img src="https://raw.githubusercontent.com/honojs/hono/main/docs/images/hono-logo.png" width="40" alt="Hono">](https://hono.dev) [Hono](https://hono.dev)                                                                                                     | 4.6.13        |
| API                 | [<img src="https://trpc.io/img/logo.svg" width="40" alt="tRPC">](https://trpc.io) [tRPC](https://trpc.io)                                                                                                                                                       | 11.0.0-rc.660 |
| Schema validation   | [<img src="https://zod.dev/logo.svg" width="40" alt="Zod">](https://zod.dev) [Zod](https://zod.dev)                                                                                                                                                             | 3.23.8        |
| UI framework        | [<img src="https://reactrouter.com/splash/hero-3d-logo.dark.webp" width="40" alt="React Router">](https://reactrouter.com) [React Router](https://reactrouter.com)                                                                                              | 7.0.2         |
| UI library          | [<img src="https://reactjs.org/favicon.ico" width="40" alt="React">](https://react.dev) [React](https://react.dev)                                                                                                                                              | 19.0.0        |
| Styling             | [<img src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg" width="40" alt="Tailwind CSS">](https://tailwindcss.com) [Tailwind CSS](https://tailwindcss.com)                                           | 4.0.0-beta.6  |
| E2E testing         | [<img src="https://playwright.dev/img/playwright-logo.svg" width="40" alt="Playwright">](https://playwright.dev) [Playwright](https://playwright.dev)                                                                                                           | 1.49.0        |
| Integration testing | [<img src="https://raw.githubusercontent.com/vitest-dev/vitest/main/docs/public/logo.svg" width="40" alt="Vitest">](https://vitest.dev) [Vitest (Browser Mode)](https://vitest.dev)                                                                     | 2.1.8         |
| Bundler             | [<img src="https://vitejs.dev/logo.svg" width="40" alt="Vite">](https://vitejs.dev) [Vite](https://vitejs.dev)                                                                                                                                                  | 6.0.3         |
| CI                  | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png" width="40" alt="GitHub Actions">](https://github.com/features/actions) [GitHub Actions](https://github.com/features/actions) | N/A           |

### Still to come

* Database connectivity - SQL and NoSQL
  * realtime subscriptions
* Containerisation with Docker
* Deployment via CD, powered by Github Actions