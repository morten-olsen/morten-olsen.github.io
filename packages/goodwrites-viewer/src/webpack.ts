import express from 'express';
import webpack, { Configuration } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { join } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import hotMiddleware from 'webpack-hot-middleware';
import devMiddleware from 'webpack-dev-middleware';

type WebpackOptions = {
  dev?: boolean;
  documentLocation: string;
};

const createWebpack = ({
  documentLocation,
  dev = false,
}: WebpackOptions): Configuration => ({
  mode: dev ? 'development' : 'production',
  context: join(__dirname, 'ui'),
  entry: ['webpack-hot-middleware/client', join(__dirname, 'ui', 'index.js')],
  module: {
    rules: [
      {
        test: documentLocation,
        loader: require.resolve('@morten-olsen/goodwrites-webpack-loader'),
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DOC_LOCATION__: JSON.stringify(documentLocation),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
});

const createServer = (options: WebpackOptions) => {
  const server = express();
  const webpackConfig = createWebpack(options);
  const compiler = webpack(webpackConfig);

  server.use(devMiddleware(compiler));
  server.use(hotMiddleware(compiler));

  return server;
};

export { createWebpack, createServer };
