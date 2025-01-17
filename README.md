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
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

1) Install the required project dependencies using pnpm : 

pnpm install

2)Start the development server to run the project locally:

pnpm dev

-->This will typically start the server at http://localhost:5173 (adjust the port if necessary).

3)Use pnpm to run a mock API server for development purposes:

  pnpm json-server db.json --port 3001

--> This will create a mock API server accessible at http://localhost:3001 (adjust the port if necessary).

Routes:

The project includes these routes (replace with your actual route paths):

http://localhost:5173/analytics-dashboard

http://localhost:5173/calendar



Handling Missing react-router Exports:

If you encounter errors related to missing exports from react-router, install the necessary packages:



pnpm add react-router-dom@7 react-router@7



Additional Notes:



->Replace db.json with the name of your actual mock API data file.

->Adjust the port numbers (3001 and potentially 5173) if necessary for your setup.

->Consider including links to relevant documentation for pnpm, json-server, and React Router for further reference.

->By following these steps, you should be able to set up, run, and develop your React project with mock API data and routing functionalities.

Browser Error
If you face any error in the browser window after running the project then refresh the browser it may arise due to the latest react-router updation

