const path = require( 'path' );

module.exports = {
	preset: 'jest-puppeteer',
	setupFilesAfterEnv: [
		'<rootDir>/config/bootstrap.js',
		// '@wordpress/jest-console',
		'expect-puppeteer',
	],
	testMatch: [
		'<rootDir>/**/*.test.js',
		'<rootDir>/specs/**/__tests__/**/*.js',
		'<rootDir>/specs/**/?(*.)(spec|test).js',
		'<rootDir>/specs/**/test/*.js',
	],
	transform: {
		'^.+\\.[jt]sx?$': path.join( __dirname, 'babel-transform' ),
	},
	transformIgnorePatterns: [ 'node_modules' ],
	testPathIgnorePatterns: [ '.git', 'node_modules' ],
	verbose: true,
};
