import { expect } from 'storybook/test';

import { Page } from './Page';

export default {
  component: Page,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
  },
};

export const LoggedOut = {};

export const LoggedIn = {
  play: async ({ canvas, userEvent }) => {
    const loginButton = canvas.getByRole('button', { name: /log in/i });
    await userEvent.click(loginButton);
    await expect(canvas.getByText('Jane Doe')).toBeVisible();
    await expect(canvas.getByRole('button', { name: /log out/i })).toBeVisible();
  },
};