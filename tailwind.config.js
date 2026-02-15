/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainBgColor: "#101316",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("children", "& > *");
    }),
    plugin(function ({ addVariant }) {
      addVariant("childrens", "& _ * _");
    }),

    plugin(function ({ addVariant, e, postcss }) {
      addVariant("firefox", ({ container, separator }) => {
        const isFirefoxRule = postcss.atRule({
          name: "-moz-document",
          params: "url-prefix()",
        });
        isFirefoxRule.append(container.nodes);
        container.append(isFirefoxRule);
        isFirefoxRule.walkRules((rule) => {
          rule.selector = `.${e(
            `firefox${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });
    }),
  ],
};
