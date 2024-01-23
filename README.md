## Monorepo for frontend challenges app

Major issues getting babel working correctly on react/next server actions (serverless functions), so now currently using dedicated node backend. Can be switched later to serverless or Golang or whatever

Must run `npm install` in both `client` and `server` directories

To add a challenge to the app, add the data to `/client/public/challenges-map.json`. It's correct shape can be found in `/client/app/types.ts`. The starter code must be converted to a single line using \n \t characters.

The server/client currently only supports react
