import '../src/app/globals.css';
import { mswLoader } from 'msw-storybook-addon/csf3';

import { mswHandlers } from './msw-handlers';

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
  loaders: [mswLoader()],
  async beforeEach({ msw }) {
    msw.use(...mswHandlers);
  },
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },
};

export default preview;