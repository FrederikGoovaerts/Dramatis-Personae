const DotEnv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProvidePlugin = require('webpack').ProvidePlugin;

const config = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.[contenthash].js',
        path: `${__dirname}/build`,
        publicPath: '/'
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            { test: /\.js$/, enforce: 'pre', loader: 'source-map-loader' },
            { test: /\.tsx?$/, loader: 'ts-loader' },
            {
                test: /\.scss$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
            },
            { test: /\.svg$/, loader: 'raw-loader' }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],

    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: 'all'
        }
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devServer = {
            open: true,
            historyApiFallback: true,
            port: 8081
        };
        config.plugins.push(new ProvidePlugin({ confEnv: `${__dirname}/src/config/env.dev.ts` }));
        config.plugins.push(new DotEnv());
    } else {
        config.plugins.push(new ProvidePlugin({ confEnv: `${__dirname}/src/config/env.prod.ts` }));
    }

    return config;
};
