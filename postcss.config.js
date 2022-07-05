module.exports = {
	syntax:  'postcss-scss',
	plugins: [
		[ 'postcss-preset-env' ],
		[ 'autoprefixer' ],
		[
			'cssnano', {
				preset: [
					'default', {
						discardComments: {
							removeAll: true
						}
					}
				]
			}
		]
	]
};
