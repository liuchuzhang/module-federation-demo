const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container
const deps = require('./package.json').dependencies

module.exports = {
  devtool: false,
  entry: './src/main.js',
  mode: 'development',
  devServer: {
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-react',
          ],
          plugins: [
            require.resolve('react-refresh/babel'),
            require.resolve('@babel/plugin-syntax-jsx')
          ]
        }
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, './index.html')
    }),
    // new ReactRefreshWebpackPlugin({
    //   overlay: false
    // }),
    new ModuleFederationPlugin({
      filename: 'remoteEntry.js',
      name: 'common',
      library: {
        type: 'var',
        name: 'common'
      },
      shared: {
        ...deps,
        react: {
          eager: true,
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          eager: true,
          singleton: true,
          requiredVersion: deps['react-dom'],
        }
      },
      exposes: {
        './TabBar': './src/TabBar.jsx'
      }
    })
  ]
}
