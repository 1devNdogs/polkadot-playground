# polkadot-task-01

- Front end code
https://github.com/1devNdogs/polkadot-task-01/tree/main/client

- Back end code
https://github.com/1devNdogs/polkadot-task-01/tree/main/


# Runing

Using yarn and node 14+

Build and run

```
yarn install

yarn build // generating public folder in root dir, this way express can be used to locate the public folder.

yarn start // expose explorer over express

```

# Development

The front end is located in the client folder.

Work in this folder runing.

```
yarn install // install dependencies
yarn dev // starting the webpack dev server.
```

The webpack-dev server will be running on port 3000.

As polkadot expose the apps in packages folder, to create new features, follow the naming standard.

- react-* for react components

- page-* for pages modules

- apps-* for apps modules ! 


```
!
-apps is the original app, so i recomend to just use a new app name like "apps-acala" this is the central app,
    (the web app build will be generated from this app-acala folder)
-config contains endpoints, api, and base app configs
-routing contains the available modules to be imported in the "apps-superswap" app

```

# Client Docs 

- https://github.com/1devNdogs/polkadot-task-01/tree/main/client
