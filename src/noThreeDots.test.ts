import { RuleTester } from '@typescript-eslint/rule-tester';
import noThreeDots from './noThreeDots';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
        jsx: true,
    },
  }
});

const tsTest = (str: string) => `const foo = '${str}';`;
const jsxTest = (str: string) => `
    const bar = () => (
        <div>${str}</div>
    );
`

ruleTester.run('no-three-dots', noThreeDots, {
  valid: [
    // TS
    tsTest('Hello, world!'), tsTest('Loading…'), tsTest('Hello... world!'),
    // JSX
    jsxTest('Hello, world!'), jsxTest('Loading…'), jsxTest('Hello... world!'),
  ],
  invalid: [
    // TS
    {
      code: tsTest('Loading...'),
      errors: [{ messageId: 'noThreeDots' }],
      output: tsTest('Loading…'),
    },
    // JSX
    {
      code: jsxTest('Loading...'),
      errors: [
        {
          messageId: 'noThreeDots',
        },
      ],
      output: jsxTest('Loading…'),
    },
  ],
});
