import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },
  pluginJs.configs.recommended,
  pluginVue.configs['flat/essential']
];
