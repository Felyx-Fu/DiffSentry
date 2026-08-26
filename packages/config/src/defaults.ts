export const DEFAULT_CONFIG = Object.freeze({
  verification: Object.freeze({
    build: false,
    lint: true,
    test: true,
    typecheck: true,
  }),
  rules: Object.freeze({}),
  thresholds: Object.freeze({
    fail: 50,
    review: 15,
  }),
});
