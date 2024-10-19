const eslint = require("@eslint/js");
const tsEslint = require("typescript-eslint");
const globals = require("globals");
const jest = require("eslint-plugin-jest");

module.exports = [
	eslint.configs.recommended,
	...tsEslint.configs.recommended,
	{
		files: ["src/**/*.ts"],
		rules: {
			semi: ["warn", "always"],
		},
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	{
		files: ["public/**/*.js"],
		rules: {
			semi: ["warn", "always"],
		},
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		files: ["**/__tests__/**/*.js", "**/*.test.js"],
		...jest.configs["flat/recommended"],
		languageOptions: {
			globals: {
				...globals.jest,
			},
		},
		rules: {
			// Jest 관련 추가 규칙 설정
		},
	},
];
