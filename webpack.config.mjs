import HtmlWebpackPlugin from 'html-webpack-plugin';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: {
    index: './src/Index.ts'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff|woff2)$/,
        use: 'url-loader'
      },
      {
        test: /\.mp3$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'sounds'
          }
        }
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader'
      },
      {
        test: /\.html$/, // Add a rule for HTML files
        use: 'html-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: [path.join(__dirname, 'dist')],
    compress: true,
    port: 8080
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/resources/template.ejs',
      title: 'PIXI Games Demo',
      description: 'Demo for PIXI Games',
      url: '',
      type: 'website',
      name: 'Demo for PIXI Games',
      inject: true
    })
  ]
};
