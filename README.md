# Frameworked

Frameworked is a web app that allows users to practice frontend coding challenges using frameworks such as React, Vue, Angular, and Svelte.

## Tech Stack

### Frontend:

-   Next.js
-   TypeScript
-   Tailwind CSS
-   Shadcn/ui
-   Zustand
-   React Query

### Backend:

-   Node.js
-   TypeScript
-   Express
-   Webpack

## Running the app

Currently the app is only mean't to be setup and run locally.

-   Fork and clone your new repo
-   Run `npm install` in both `client` and `server` directories
-   Run `npm run dev` in both `client` and `server` directories to start the app
-   `/client/` currently runs on port 3000 and `/server/` runs on port 3001

## Adding a challenge

To add a challenge to the app, add the data to `/client/public/challenges-map.json`. It's correct shape can be found in `/client/app/types.ts`. The starter code must be converted to a single line using \n \t characters.

## Roadmap

The app is currently in a very early stage of development. To bring the app to a potential v1.0.0, the following features need to be implemented:

-   Local DB to store user progress
-   More challenges
-   Frontend functionality and design improvements (see issues)
-   Backend improvements (see issues)
-   Testing
-   Improved local setup experience

After v1.0.0, I would like to create a hosted version of the app and add more features such as:

-   User authentication
-   Leaderboards
-   Hosted DB to store user progress
-   Heightened security measures
-   Improved backend performance

A hosted version of the app would likely require a paid plan to cover server costs. These features would very likely be free for any locally hosted version of the app and would consist of potential features such as:

-   TypeScript support
-   Hard challenges
-   More frameworks

None of this is guaranteed and is subject to change. Please add to any discussion in the discord or relevant issues.
