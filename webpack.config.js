// PATH
const path = require("path");

// PLUGIN
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, "src", "app.js"),
  output: {
    path:path.resolve(__dirname, "docs"),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif|txt)$/,
        use: ['file-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "license.html"),
      filename: 'license.html',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    }),
  ],
}