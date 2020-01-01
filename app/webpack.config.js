const package = require('./package.json');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const nodeEnv = (process.env.NODE_ENV || 'development').trim();

const styleLoader = nodeEnv !== 'production' ?
	'vue-style-loader' :
	MiniCssExtractPlugin.loader;

const postcssLoader = {
	loader: 'postcss-loader',
	options: {
		sourceMap: true
	}
};

const cssLoader = [
	styleLoader,
	{
		loader: 'css-loader',
		options: {
			importLoaders: 1
		}
	},
	postcssLoader
];

const lessLoader = [
	styleLoader,
	{
		loader: 'css-loader',
		options: {
			importLoaders: 2
		}
	},
	postcssLoader,
	'less-loader'
];

module.exports = {
	entry: {
		qnak: path.resolve(__dirname, 'app', 'index.js')
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/',
		filename: '[name].bundle.js'
	},

	mode: nodeEnv,

	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						'css': cssLoader,
						'less': lessLoader,
						'js': 'babel-loader'
					}
				}
			},

			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: [/node_modules/]
			},

			{
				test: /\.less$/,
				use: lessLoader
			},

			{
				test: /\.css$/,
				use: cssLoader
			},

			{
				test: /\.(png|jpe?g|gif|woff2?|otf|ttf|eot|svg)(\?|#.*)?$/,
				loader: 'file-loader',
				options: {
					name: 'files/[hash:8].[ext]'
				}
			}
		]
	},

	resolve: {
		mainFields: ['browser', 'module', 'style', 'main']
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': `"${nodeEnv}"`
		}),
		new HtmlWebpackPlugin({
			template: './index.html',
			filename: './token.html'
		}),
		new MiniCssExtractPlugin({
			filename: '[name].bundle.css'
		}),
		new VueLoaderPlugin()
	],

	devtool: '#eval-source-map',
	devServer: {
		historyApiFallback: {
			index: '/dist/'
		}
	}
};

if (nodeEnv === 'production') {
	module.exports.devtool = '#source-map';
	module.exports.optimization = {
		minimize: true
	};
}
