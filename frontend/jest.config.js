module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/internals/testing/setupTests.ts'],
	moduleNameMapper: {
		'@assets/(.*)': '<rootDir>/assets/$1',
		'@controls/(.*)': '<rootDir>/src/v5/ui/controls/$1',
		'^@/(.*)$': '<rootDir>/src/$1',
    	'@components/(.*)': '<rootDir>/src/v5/ui/components/$1',
		'^axios$': require.resolve('axios'),
	},
	transform: {
		'^.+\\.svg$': '<rootDir>/internals/testing/svgTransform.ts',
	},
	transformIgnorePatterns: [
		"node_modules/(?!byte-size/.*)"
	],
};

