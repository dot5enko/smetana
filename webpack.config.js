const { ProvidePlugin, DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { resolve } = require('path');
const fs = require('fs');

const SRC_DIR = resolve(__dirname, './src');
const DIST_DIR = resolve(__dirname, './dist');

const manifest = JSON.parse(fs.readFileSync(resolve(SRC_DIR, 'manifest', 'manifest.json')).toString())

module.exports = [
    (env, { mode }) => ({
        name: 'background',
        target: 'webworker',
        devtool: mode === 'development' ? 'inline-source-map' : false,
        context: SRC_DIR,
        entry: {
            worker: ['./background/worker'],
        },
        output: {
            filename: 'js/background.js',
            path: DIST_DIR,
            // libraryTarget: 'commonjs2',
        },
        experiments: {
            asyncWebAssembly: true,
        },
        optimization: {
            chunkIds: 'named',
            moduleIds: 'named',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.wasm'],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                        },
                    },
                },
            ],
        },

        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'manifest/manifest.json',
                        to: 'manifest.json',
                        transform(content) {
                            return content;
                        },
                    },
                ],
            }),
            new DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
                'process.env.EXT_VERSION': JSON.stringify(manifest.version),
            }),
            new ProvidePlugin({
                process: 'process/browser',
            }),
        ],
    }),
    (env, { mode }) => ({
        name: 'popup',
        // dependencies: ['worker'],
        devtool: mode === 'development' ? 'inline-source-map' : false,
        context: SRC_DIR,
        
        entry: {
            popup: ['./popup/index'],
            content: ['./content/explorer'],
        },

        output: {
            filename: 'js/[name].js',
            path: DIST_DIR,
            assetModuleFilename: 'assets/[name][ext][query]',
            publicPath: '',
        },

        experiments: {
            asyncWebAssembly: true,
        },

        optimization: {
            chunkIds: 'named',
            moduleIds: 'named',
        },

        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.wasm'],
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.json',
                        },
                    },
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },

        plugins: [
            new DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
                'process.env.EXT_VERSION': JSON.stringify(manifest.version),
            }),
            new ProvidePlugin({
                process: 'process/browser',
            }),
            new HtmlWebpackPlugin({
                template: './popup/index.html',
                chunks: ['popup'],
                filename: 'index.html',
            })
        ],
    }),
];