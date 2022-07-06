module.exports = ({ serve }, argv) => {
	const webpack = require('webpack');
	const path = require('path');
	const fs = require('fs-extra');
	const MiniCssExtractPlugin = require('mini-css-extract-plugin');
	const { VueLoaderPlugin } = require('vue-loader');
	const TerserPlugin = require('terser-webpack-plugin');
	const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
	const HtmlWebpackPlugin = require('html-webpack-plugin');
	const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
	const StylelintPlugin = require('stylelint-webpack-plugin');
	const ESLintPlugin = require('eslint-webpack-plugin');
	const { VuetifyLoaderPlugin } = require('vuetify-loader');

	/* clear */
	[ 'dist' ].forEach(element => fs.removeSync(element));
	console.info('Файли видалено');

	/* \ clear */

	/* timestamp  */
	const T = Number(new Date());

	fs.mkdirSync('dist');
	fs.stat('dist/includes', function(err) {
		if (err && err.code === 'ENOENT') fs.mkdirSync('dist/includes');
		fs.writeFile(path.resolve(__dirname, 'dist/includes/releaseSalt.php'), `<? $releaseSalt = "${T}"; ?>`);
	});
	console.info(`timestamp: ${T} 🌍`);

	/* \ timestamp */

	const pl = [];

	if (argv.mode === 'development') {
		pl.push(new webpack.SourceMapDevToolPlugin({
			filename: '[file].map'
		}));
	}
	else {
		pl.push(new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false
		}));
	}

	const babel = {
		loader:  'babel-loader',
		options: {
			cacheDirectory: true
		}
	};
	const loaders = {
		babel: {
			test:    /\.js$/,
			use:     [ babel ]
		},
		vue: {
			test:    /\.vue$/,
			loader:  'vue-loader',
			options: {
				esModule: true
			}
		},
		ts: {
			test:    /\.ts$/,
			loader:  'ts-loader',
			options: {
				appendTsSuffixTo: [ /\.vue$/ ]
			}
		},
		pug: {
			test:  /\.pug$/,
			oneOf: [
				{
					resourceQuery: /^\?vue/,
					use:           [ 'pug-plain-loader' ]
				}, {
					use: [ 'raw-loader', 'pug-plain-loader' ]
				}
			]
		},
		style: {
			miniCSS: {
				loader: MiniCssExtractPlugin.loader
			},
			css: {
				loader:  'css-loader',
				options: {
					url:            false,
					sourceMap:      argv.mode === 'development'
				}
			},
			cssModule: {
				loader:  'css-loader',
				options: {
					url:            false,
					sourceMap:      argv.mode === 'development',
					modules:   {
						localIdentName: argv.mode === 'development' ? '[local]-[hash:base64:12]' : '_[hash:base64:4]'
					}
				}
			},
			postcss: {
				loader:  'postcss-loader',
				options: {
					sourceMap: argv.mode === 'development'
				}
			},
			sass: {
				loader:  'sass-loader',
				options: {
					sourceMap:      argv.mode === 'development',
					implementation: require('sass'),
					sassOptions:    {
						// indentedSyntax: true,
						includePaths:   [ 'node_modules' ]
					}
				}
			},
			sassResources: {
				loader:  'sass-resources-loader',
				options: {
					resources: [ 'src/scss/util/settings.scss' ]
				}
			}
		}
	};

	const pages = () => {
		const files = fs.readdirSync(path.resolve(__dirname, 'src/views'));
		const pageNames = [];
		const pages = [];

		files.map(file => {
			if (path.extname(file) === '.pug') pageNames.push(path.basename(file, '.pug'));
		});
		serve && pageNames.forEach(name => {
			pages.push(new HtmlWebpackPlugin({
				template:      `src/views/${name}.pug`,
				filename:      `${name}.html`,
				minify:        false,
				inject:        false,
				scriptLoading: 'blocking'
			}));
		});

		return pages;
	};

	return {
		entry: () => {
			const pageNames = [];
			const entry = {};
			const files = fs.readdirSync(path.resolve(__dirname, 'src/entry'));

			files.map(file => {
				if (path.extname(file) === '.ts') pageNames.push(path.basename(file, '.ts'));
			});
			pageNames.forEach(name => {
				entry[name] = path.resolve(__dirname, 'src/entry/', `${name}.ts`);
			});

			return entry;
		},
		output: {
			filename: 'js/[name].bundle.js',
			path:     path.resolve(__dirname, 'dist')
		},
		cache: argv.mode === 'development'
			? {
					type:           'filesystem',
					cacheDirectory: path.resolve(__dirname, '.temp_cache'),
					hashAlgorithm:  'md4',
					name:           'AppBuildCache'
				}
			: false,
		plugins: [
			new webpack.ProvidePlugin({
				mapState:     [ 'vuex', 'mapState' ],
				mapGetters:   [ 'vuex', 'mapGetters' ],
				mapActions:   [ 'vuex', 'mapActions' ],
				mapMutations: [ 'vuex', 'mapMutations' ],
				axios:        [ 'axios', 'default' ]
			}),
			new ESLintPlugin({
				extensions: [
					'js',
					'ts',
					'vue'
				],
				fix:        true
			}),
			new VueLoaderPlugin(),
			new MiniCssExtractPlugin({
				filename: 'css/[name].bundle.css'
			}),
			...pl,
			new MiniCssExtractPlugin({
				filename: 'css/[name].bundle.css'
			}),
			new StylelintPlugin({
				files:   [ '**/*.scss', '**/*.vue' ]
			}),
			...pages(),
			new HtmlWebpackPugPlugin({
				adjustIndent: true
			}),
			new webpack.ProgressPlugin({
				activeModules:     false,
				entries:           true,
				modules:           true,
				modulesCount:      5000,
				profile:           false,
				dependencies:      true,
				dependenciesCount: 10000,
				percentBy:         null
			}),
			new VuetifyLoaderPlugin()
		],
		resolve: {
			alias: {
				vue$:  'vue/dist/vue.runtime.esm.js',
				_scss:  path.resolve(__dirname, 'src/scss'),
				_ts:    path.resolve(__dirname, 'src/ts')
			},
			extensions: [
				'.ts',
				'.vue',
				'.js'
			]
		},
		optimization: {
			splitChunks: {
				chunks:                 'all',
				minSize:                10,
				minChunks:              4,
				cacheGroups:            {
					defaultVendors: {
						test:     /[\\/]node_modules[\\/]/,
						name:        'vendors'
					},
					default: {
						name:               'commons',
						minChunks:          4,
						priority:           -20,
						reuseExistingChunk: true
					}
				}
			},
			minimizer: [
				new TerserPlugin({
					extractComments: {
						condition: true,
						filename:  'extracted-comments.txt',
						banner:    () => {
							return '';
						}
					}

				})
			]
		},
		module: {
			rules: [
				loaders.babel,
				loaders.vue,
				loaders.ts,
				{
					test:  /\.s?[ac]ss$/,
					oneOf: [
						{
							resourceQuery: /module/,
							use:           [
								loaders.style.miniCSS,
								loaders.style.cssModule,
								loaders.style.postcss,
								loaders.style.sass,
								loaders.style.sassResources
							]
						}, {
							use: [
								loaders.style.miniCSS,
								loaders.style.css,
								loaders.style.postcss,
								loaders.style.sass,
								loaders.style.sassResources
							]
						}
					]
				},
				loaders.pug
			]
		},
		devtool:   argv.mode === 'development' ? 'eval-source-map' : false,
		devServer:
			{
				static: {
					directory: path.join(__dirname, 'dist')
				},
				compress:    true,
				port:        9000
			},
		stats: {
			children:     false,
			entrypoints:  false,
			modules:      false,
			warnings:     false,
			errors:       true,
			errorDetails: true,
			hash:         false,
			version:      false,
			builtAt:      false
		},
		performance: {
			hints: false
		}
	};
};
