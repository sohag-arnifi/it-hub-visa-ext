const path = require("path");
const webpack = require("webpack");
const { fileURLToPath } = require("url");

module.exports = {
  mode: "development",
  entry: {
    popup: "./popup/popup.js", // Entry point for popup
    content: "./content/content.js", // Entry point for content script
    background: "./background/background.js", // Entry point for background script
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js", // Output each bundle by entry point
    publicPath: "/dist/", // Ensure Webpack knows the public path for hot-reload assets
  },
  devtool: "inline-source-map", // For better debugging support
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Serve static files from dist
    },
    hot: true, // Enable Hot Module Replacement
    watchFiles: [
      "popup/**/*.html",
      "popup/**/*.js",
      "content/**/*.js",
      "background/**/*.js",
    ], // Watch for changes in these files
    client: {
      overlay: true, // Show error overlay if there are build errors
    },
    port: 9000, // Choose a port for the dev server
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"], // Provide Buffer as a global variable
      process: require.resolve("process/browser"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env", // Transpile modern JS syntax
              "@babel/preset-react", // Transpile JSX syntax
            ],
          },
        }, // Transpile JavaScript files
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // Handle CSS files if needed
      },
    ],
  },
  resolve: {
    fallback: {
      http: "stream-http", // Change require.resolve to module string
      https: "https-browserify",
      buffer: "buffer/",
      url: "url/",
      stream: "stream-browserify", // Add stream polyfill
      util: "util/", // Add utl polyfill
    },
    extensions: [".js", ".jsx"],
  },
};
