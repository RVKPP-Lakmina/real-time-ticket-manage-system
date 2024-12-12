# Real Time Ticket Simulation System.

## Node JS

Before you start the Project you have to have installed Correct version of Node Js.

[Install Node Js From Here](https://nodejs.org/en/download/package-manager)

## Installation

```
    unzip the w959866 folder
```

Then you should navigate to the folder.

```
    cd real-time-ticket-manage-system
```

Then You should open your terminal or your IDE from there.

```bash
   code .
```

Using above code you can open vs code

Once you start the you IDE, then you have to install all the dependancies for the project which means node_modules folder.

for that run the below command.

```bash
    npm install
```

when occured any error try below command. But not recommendant.

```bash
    npm install --force
```

```bash
    npm install -f
```

So here we come to End You Can now start your projects from here.

for start:

```
    npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_WEBSOCKET_URL`: `ws://localhost:8080/ticketing-websocket`

`VITE_BACKEND_HOST`: `http://localhost:8080/api`

## Deployment

To deploy this project run

```bash
  npm run build
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
