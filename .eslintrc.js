module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    jest: true,
    es6: true,
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  extends: [
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'import',
  ],
  rules: {
    'import/no-unresolved': ['error', {ignore: ['^@hrdrone\/*']}],
    'prettier/prettier': ['error', {singleQuote: true, trailingComma: 'all', tabWidth: 2, bracketSpacing: true}],
    /**
     * plugin:simple-import-sort
     */
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    /**
     * plugin:typescript-eslint
     */
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {argsIgnorePattern: '^_', 'vars': 'all', 'args': 'after-used'},
    ],
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', {default: 'array-simple'}],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          'Object': {
            message: 'Avoid using the `Object` type. Did you mean `object`?',
          },
          'Function': {
            message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
          },
          'Boolean': {
            message: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
            fixWith: 'boolean',
          },
          'Number': {
            message: 'Avoid using the `Number` type. Did you mean `number`?',
            fixWith: 'number',
          },
          'Symbol': {
            message: 'Avoid using the `Symbol` type. Did you mean `symbol`?',
            fixWith: 'symbol',
          },
          'String': {
            message: 'Avoid using the `String` type. Did you mean `string`?',
            fixWith: 'string',
          },
          '{}': {
            message: 'Use Record<K, V> instead',
            fixWith: 'Record<K, V>',
          },
          'object': {
            message: 'Use Record<K, V> instead',
            fixWith: 'Record<K, V>',
          },
        },
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        overrides: {
          constructors: 'off',
        },
      },
    ],
    // '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/quotes': [
      'warn',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
        filter: {
          regex: '^_.*$',
          match: false,
        },
      },
    ],
    '@typescript-eslint/no-duplicate-imports': ['error'],
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-expressions': ['error'],
    /**
     * plugin:eslint
     */
    'no-await-in-loop': 'error',
    'padding-line-between-statements': [
      'error',
      {blankLine: 'always', prev: '*', next: 'return'},
      {blankLine: 'always', prev: '*', next: 'try'},
      {blankLine: 'always', prev: 'try', next: '*'},
      {blankLine: 'always', prev: '*', next: 'block-like'},
      {blankLine: 'always', prev: 'block-like', next: '*'},
      {blankLine: 'always', prev: '*', next: 'throw'},
      {blankLine: 'always', prev: 'var', next: '*'},
    ],
    'arrow-parens': ['error', 'always'],
    'complexity': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'rxjs/Rx',
            message: 'Please import directly from \'rxjs\' instead',
          },
        ],
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'no-multi-spaces': 'error',
    'no-useless-return': 'error',
    'no-else-return': 'error',
    'no-implicit-coercion': 'error',
    'constructor-super': 'error',
    'yoda': 'error',
    'strict': ['error', 'never'],
    'curly': 'error',
    'dot-notation': 'error',
    'eol-last': 'error',
    'eqeqeq': ['error', 'smart'],
    'guard-for-in': 'error',
    'id-match': 'error',
    'max-classes-per-file': ['error', 3],
    'max-len': [
      'error',
      {
        code: 180,
      },
    ],
    'lines-between-class-members': ['error', 'always'],
    'no-console': [
      'warn',
      {
        allow: [
          'info',
          'dirxml',
          'warn',
          'error',
          'dir',
          'timeLog',
          'assert',
          'clear',
          'count',
          'countReset',
          'group',
          'groupCollapsed',
          'groupEnd',
          'table',
          'Console',
          'markTimeline',
          'profile',
          'profileEnd',
          'timeline',
          'timelineEnd',
          'timeStamp',
          'context',
        ],
      },
    ],
    'no-debugger': 'error',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'off',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-extra-bind': 'error',
    'no-fallthrough': 'error',
    'no-invalid-this': 'error',
    'no-irregular-whitespace': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
      },
    ],
  },
};