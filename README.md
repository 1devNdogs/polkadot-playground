# polkadot-task-01

- Front end code
https://github.com/1devNdogs/polkadot-task-01/tree/main/client

- Back end code
https://github.com/1devNdogs/polkadot-task-01/tree/main/

# client/packages/apps-acala/build

Contains the build of the web explorer

# runing

Using yarn and node 14+

Build and run

```
cd client && yarn install && cd ..

yarn build:front // generating public folder in root dir, this way express can be used to locate the public folder.

yarn start

```

# development

The front end is located in the client folder. Work in this folder runing.

```
yarn install // install dependencies
yarn dev // starting the webpack dev server.
```

The server will be running on port 3000.

As polkadot serves the apps in packages folder, to create new features, follow the naming standard

reac-* for react components
page-* for pages modules
apps-* for apps modules ! 
    apps is the original app, so i recomend to just use a new app name like "apps-superswap" this is the central, the build will be generated in here.
        (remember to change the app-superswap in package.json scripts that create the build and clean directories)
    config contains endpoints, api, and base app configs
    routing contains the available modules to be imported in the "apps-superswap" app