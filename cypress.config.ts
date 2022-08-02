import { defineConfig } from "cypress";
import webpackPreprocessor from "@cypress/webpack-preprocessor";

const webpackOptions = {
  webpackOptions: {
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
  },
};

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("file:preprocessor", webpackPreprocessor(webpackOptions));
    },
    baseUrl: "http://localhost:3000",
    fixturesFolder: false,
    supportFile: false,
    specPattern: "src/main/test/cypress/integration/**/*.cy.ts",
  },
});
