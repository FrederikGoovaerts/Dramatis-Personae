const DotEnv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.[hash].js',
        path: `${__dirname}/build`
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
        config.plugins.push(
            new DotEnv({
                path: './.env'
            })
        );
    }

    return config;
};
