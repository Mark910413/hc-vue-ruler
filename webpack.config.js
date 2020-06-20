const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
 template: path.join(__dirname, "examples/src/index.html"),
 filename: "./index.html"
});
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
 entry: path.join(__dirname, "examples/src/main.js"),
 module: {
  rules: [
    {
      test: /\.vue/,
      use: "vue-loader",
    },
    {
      test: /\.(js|jsx)$/,
      use: "babel-loader",
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    },
  ]
},
 plugins: [htmlWebpackPlugin,  new VueLoaderPlugin()],
 resolve: {
   extensions: [".js", ".jsx"]
 },
 devServer: {
   port: 3000,
   host: '0.0.0.0',
}};