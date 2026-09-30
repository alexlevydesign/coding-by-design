import { faArrowRight, faCheck, faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { expect, fn } from 'storybook/test';

import { Button } from './Button';

export default {
  component: Button,
  tags: ['ai-generated'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'ghost'],
    },
    inverse: { control: 'boolean' },
    iconBefore: { control: false },
    iconAfter: { control: false },
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: { variant: 'primary', label: 'Continue' },
};

export const Outline = {
  args: { variant: 'outline', label: 'Learn more' },
};

export const Ghost = {
  args: { variant: 'ghost', label: 'Skip' },
};

export const Inverse = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', background: 'var(--color-gray-100)', padding: 24 }}>
      <Button variant="primary" inverse label="Primary" />
      <Button variant="outline" inverse label="Outline" />
      <Button variant="ghost" inverse label="Ghost" />
    </div>
  ),
};

export const IconsBeforeAndAfter = {
  args: {
    variant: 'primary',
    iconBefore: faCirclePlus,
    iconAfter: faArrowRight,
    label: 'Add item',
  },
};

export const IconOnly = {
  args: {
    variant: 'ghost',
    iconBefore: faXmark,
    'aria-label': 'Close',
  },
};

export const CssCheck = {
  args: {
    variant: 'primary',
    label: 'Styled button',
    iconAfter: faCheck,
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /styled button/i });
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(79, 50, 154)');
  },
};