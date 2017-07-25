// * Created by edwardwieczorek on 8/7/15.
//===============================
import webpack from 'webpack';
import path from 'path';
import poststylus from 'poststylus';
import autoprefixer from 'autoprefixer';
import rucksackCSS from 'rucksack-css';
import rupture from 'rupture';
import lost from 'lost';
import WebpackWriteFilePlugin from 'write-file-webpack-plugin';

const PATHS = {
  scripts: path.join(__dirname, 'scripts'),
  style: path.join(__dirname, '_site/cdn/css'),
  build: path.join(__dirname, '_site/cdn/dist'),
  site: path.join(__dirname, '_site'),
  entries: {
    'main':'./main.js',
  }
};

export default {
  context: PATHS.scripts,
  entry: PATHS.entries,
  output: {
    path: PATHS.build,
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: PATHS.build
  },
  devServer: {
    outputPath: PATHS.build
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.scss', '.styl'],
    modules: ['node_modules', 'bower_components']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js',
      chunks: Infinity
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    // MUST BE IN THE WEBPACK CONFIG FILE!!!!
    new WebpackWriteFilePlugin({log:false, stats:'errors-only'}),
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [
            rupture(),
            poststylus([autoprefixer, rucksackCSS, lost(), require('postcss-flexibility')])
          ]
        },
      }
    })
  ],
  externals: {
    "foxy":"FC",
    "FC": "FC"
  },
  module: {
    rules: [
      { test: /\.js$/, loaders: ['babel-loader?cacheDirectory=true,presets[]=react,presets[]=es2015,presets[]=stage-0'],
        exclude: [/node_modules/, /bower_components/, /\.test\.js$/]
      },
      { test: /\.html$/, use: 'raw-loader', exclude: [/node_modules/, /bower_components/] },
      { test:/\.css?$/, use: "style-loader!css-loader" },
      { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/, use: "file-loader" },
      { test: /\.styl?$/,
        use: [
          { loader: "style-loader"},
          { loader: "css-loader"},
          { loader: "stylus-loader"}
        ]
      },
      { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: "file-loader" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: "url-loader?limit=10000&mimetype=image/svg+xml" }
    ]
  },
};
