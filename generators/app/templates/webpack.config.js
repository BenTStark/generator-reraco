const path = require("path");
var _ = require("lodash");
var minimist = require("minimist");
var chalk = require("chalk");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

//const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const moduleObj = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    },
    {
      test: /\.(scss|css)$/,
      use: [
        {
          loader: "style-loader" // creates style nodes from JS strings
        },
        {
          loader: "css-loader", // translates CSS into CommonJS
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: "[local]"
          }
        },
        {
          loader: "sass-loader" // compiles Sass to CSS
        }
      ]
    },
    {
      test: /\.(jpg|png)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].png"
        }
      }
    }
  ]
};
var DEFAULT_TARGET = "BUILD";

var DEFAULT_PARAMS = {
  resolve: {
    extensions: [".js"]
  },
  entry:
    [
      path.resolve(__dirname, "dist/public/index.js")
    ],
  target: "web",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist/public")
  },
  module: moduleObj,
  plugins: [
    new HtmlWebPackPlugin({
      template: "src/client/index.html"
    }),
    new Dotenv()
  ]
};

var PARAMS_PER_TARGET = {
  DEV: {
    devtool: "source-map",
    output: {
      filename: "index.js"
    },
    mode: "development",
    optimization: {
      minimize: false
    },
    plugins: [
      new CleanWebpackPlugin(["dist/public"]),
      new BundleAnalyzerPlugin({ analyzerMode: "disabled" })
    ]
  },

  DEV_SERVER: {
    devtool: "source-map",
    entry:
      [
        "webpack-dev-server/client?http://www.example.com/",
        "webpack/hot/only-dev-server",
        path.resolve(__dirname, "src/client/index.js")
      ],
    output: {
      filename: "index.js"
    },
    mode: "development",
    devServer: {
      host: "127.0.0.1",
      port: 9000,
      https: false,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
  },

  BUILD: {
    output: {
      path: path.resolve(__dirname, "dist/build")
    },
    devtool: "source-map",
    mode: "production",
    plugins: [new CleanWebpackPlugin(["dist/build"])]
  }

};
var target = _resolveBuildTarget(DEFAULT_TARGET);
var params = _.merge(
  DEFAULT_PARAMS,
  PARAMS_PER_TARGET[target],
  _mergeArraysCustomizer
);

_printBuildInfo(target, params);
module.exports = smp.wrap(params);

function _resolveBuildTarget(defaultTarget) {
  var target = minimist(process.argv.slice(2)).TARGET;
  if (!target) {
    console.log("No build target provided, using default target instead\n\n");
    target = defaultTarget;
  }
  return target;
}
function _printBuildInfo(target, params) {
  console.log("\nStarting " + chalk.bold.green('"' + target + '"') + " build");
  if (target === "DEV_SERVER") {
    console.log(
      "Dev server: " +
        chalk.bold.yellow(
          "http://localhost:" + params.devServer.port + "/lokal"
        ) +
        "\n\n"
    );
  } else {
    console.log("\n\n");
  }
}

function _mergeArraysCustomizer(a, b) {
  if (_.isArray(a)) {
    return a.concat(b);
  }
}
