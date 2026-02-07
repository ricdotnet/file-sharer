import eslintConfigRicdotnet from 'eslint-config-ricdotnet';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt()
  .prepend(eslintConfigRicdotnet)
  .override('nuxt/vue/rules', {
    rules: {
      'vue/multi-word-component-names': ['error', {
        'ignores': ['Button', 'Input', 'Navbar', 'Spinner'],
      }],
    }
  })
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    }
  });
