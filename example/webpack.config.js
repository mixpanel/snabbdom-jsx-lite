/* eslint-env node */
const path = require(`path`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);

const toBool = (str) => Boolean(str && (str.toLowerCase() === `true` || str === `1`));
const exampleDir = __dirname;
const rootDir = path.resolve(__dirname, `..`);
const distDir = path.resolve(rootDir, `dist_example`);

const tsLoader = () => ({
  loader: `ts-loader`,
  options: {
    happyPackMode: true,
    compilerOptions: {isolatedModules: true},
  },
});

const rules = [
  {
    test: /\.tsx?$/,
    include: rootDir,
    exclude: /(\.(d)\.ts$)/,
    use: [tsLoader()],
  },
];

const webpackConfig = {
  context: exampleDir,
  devtool: `sourcemap`,
  entry: {
    app: `./app`,
  },
  mode: process.env.NODE_ENV || `development`,
  module: {rules},
  node: {
    __dirname: true,
    __filename: true,
  },
  output: {
    filename: `[name].js`,
    path: distDir,
  },
  performance: {
    hints: false,
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: path.join(exampleDir, `index.html`), to: distDir},
      {from: path.join(exampleDir, `app.css`), to: distDir},
    ]),
  ],
  resolve: {
    extensions: [`.js`, `.ts`, `.tsx`],
  },
  watch: toBool(process.env.WATCH),
};

module.exports = webpackConfig;
