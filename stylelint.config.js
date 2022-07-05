const sortOrderSmacss = require('stylelint-config-property-sort-order-smacss/generate');

module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-property-sort-order-smacss',
		'stylelint-config-recommended-scss',
		'stylelint-config-standard-scss'
	],
	overrides: [
		{
			files:        [ '*.vue', '**/*.vue' ],
			customSyntax: 'postcss-html'
		}
	],
	plugins: [ 'stylelint-scss' ],
	rules:   {
		'selector-class-pattern':                    '[a-z\\-_\\d]+',
		'alpha-value-notation':                      'number',
		'at-rule-no-vendor-prefix':                  true,
		'color-function-notation':                   'legacy',
		'color-named':                               'never',
		'color-no-hex':                              true,
		'declaration-block-no-duplicate-properties': true,
		'declaration-no-important':                  true,
		'declaration-bang-space-after':              'never',
		'font-family-name-quotes':                   'always-where-required',
		'font-weight-notation':                      'numeric',
		'function-parentheses-newline-inside':       'always-multi-line',
		'function-url-no-scheme-relative':           true,
		'hue-degree-notation':                       'number',
		'selector-attribute-quotes':                 'always',
		'selector-list-comma-space-after':           'never-single-line',
		'selector-list-comma-space-before':          'always-single-line',
		'selector-type-case':                        'lower',
		'string-quotes':                             'single',
		indentation:                                 'tab',
		'max-line-length':                           120,
		'max-nesting-depth':                         4,
		'media-feature-name-no-vendor-prefix':       true,
		'media-feature-parentheses-space-inside':    'always',
		'no-unknown-animations':                     true,
		'number-max-precision':                      4,
		'number-leading-zero':                       'never',
		'property-no-vendor-prefix':                 [ true, { ignoreProperties: [ /appearance/ ] } ],
		'time-min-milliseconds':                     50,
		'shorthand-property-no-redundant-values':    true,
		'value-no-vendor-prefix':                    true,

		/* Plugins */
		// scss
		'scss/at-rule-conditional-no-parentheses':     true,
		'scss/selector-nest-combinators':              'always',
		'scss/selector-no-redundant-nesting-selector': true,
		'scss/no-duplicate-dollar-variables':          true,
		'scss/no-duplicate-mixins':                    true,

		// order
		'order/properties-order': [
			sortOrderSmacss({
				emptyLineBefore: 'never'
			})
		]
	}
};
