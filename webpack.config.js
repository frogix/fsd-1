const path = require("path");
const fs = require("fs");

const opts = {
  dirs: {
    src: path.resolve(__dirname, "src"),
    dist: path.resolve(__dirname, "dist"),
    templateDir: path.resolve(__dirname, "src", "pages"),
  },
};

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(opts.dirs.src, "index.js"),
  plugins: [
    // Removes build folder before building
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
  ]
    // array of HTML plugins for each page in templateDir
    .concat(generateHtmlPlugins(opts.dirs.templateDir)),

  devServer: {
    contentBase: opts.dirs.dist,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.pug$/i,
        loader: "pug-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: opts.dirs.dist,
  },
};

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(templateDir);
  return templateFiles.map((item) => {
    // Split names and extension
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
    });
  });
}

// We will call the function like this:
// const htmlPlugins = generateHtmlPlugins("./src/template/views");
