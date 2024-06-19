const iTwinjsPlugin = require("@itwin/eslint-plugin");

module.exports = [
  {
    files: ["**/*.{ts,tsx}"],
    ...iTwinjsPlugin.configs.iTwinjsRecommendedConfig
  }
];
