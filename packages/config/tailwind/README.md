# Shared Tailwind setup

This package contains the shared Tailwind configuration for all apps in the Turborepo.

## Usage in apps

1. **Reference the shared Tailwind config** from your app's Tailwind config.

   ```ts
   // apps/<app-name>/tailwind.config.ts
   import sharedConfig from "../../packages/config/tailwind/tailwind.config";

   export default sharedConfig;
   ```

2. **Point PostCSS to the shared config** from your app's PostCSS config.

   ```js
   // apps/<app-name>/postcss.config.cjs
   module.exports = {
     plugins: {
       tailwindcss: {
         config: "../../packages/config/tailwind/tailwind.config.ts",
       },
       autoprefixer: {},
     },
   };
   ```

3. **Import Tailwind styles** in your app's global stylesheet (or equivalent entry file).

   ```css
   /* apps/<app-name>/src/styles.css */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

   Then ensure the stylesheet is imported in your app entry point, for example:

   ```ts
   // apps/<app-name>/src/main.tsx
   import "./styles.css";
   ```
