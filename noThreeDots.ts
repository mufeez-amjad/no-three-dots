import { ESLintUtils } from "@typescript-eslint/utils";

const ellipsis = "…";
const threeDots = "...";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://example.com/rule/${name}` //TODO: replace with repo URL
);

// Type: RuleModule<"uppercase", ...>
const rule = createRule({
  name: "uppercase-first-declarations",
  meta: {
    docs: {
      description: "Disallow three dots in string literals. Prefer ellipsis.",
    },
    type: "problem",
    messages: {
      noThreeDots: `Use ellipsis character (${ellipsis}) instead of three dots (${threeDots}).`,
    },
    schema: [],
    fixable: "code",
  },
  defaultOptions: [],
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value !== "string") {
          return;
        }

        if (!node.value.endsWith(threeDots)) {
          // Only check for three dots at the end of the string.
          return;
        }

        const idx = node.value.indexOf(threeDots);
        if (idx === -1) {
          return;
        }

        context.report({
          node,
          messageId: "noThreeDots",
          fix(fixer) {
            if (!node.range) {
              return null;
            }
            const startIdx = node.range[0] + idx + 1;
            return fixer.replaceTextRange(
              [startIdx, startIdx + threeDots.length],
              ellipsis
            );
          },
        });
      },
      JSXText: (node) => {
        if (/\.{3}$/.test(node.value)) {
          context.report({
            node,
            messageId: "noThreeDots",
            fix: function (fixer) {
              return fixer.replaceText(
                node,
                node.value.replace(/\.{3}$/, ellipsis)
              );
            },
          });
        }
      },
    };
  },
});

export default rule;