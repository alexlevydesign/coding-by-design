import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './button.css';

/** Reusable button with token-based variants, inverse colors, and optional icons. */
export const Button = ({
  primary,
  variant,
  inverse,
  size,
  label,
  iconBefore,
  iconAfter,
  ...props
}) => {
  const resolvedVariant = primary ? 'primary' : variant;
  const classes = [
    'button',
    'type-body-bold',
    `button--${size}`,
    `button--${resolvedVariant}`,
    inverse && 'button--inverse',
    !label && 'button--icon-only',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      {...props}
    >
      {iconBefore && <FontAwesomeIcon icon={iconBefore} aria-hidden="true" />}
      {label}
      {iconAfter && <FontAwesomeIcon icon={iconAfter} aria-hidden="true" />}
    </button>
  );
};

Button.propTypes = {
  /** Backward-compatible shorthand for variant="primary". */
  primary: PropTypes.bool,
  /** Button treatment. */
  variant: PropTypes.oneOf(['primary', 'outline', 'ghost']),
  /** Swap the default purple and white colors. */
  inverse: PropTypes.bool,
  /** How large should the button be? */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Optional button text. Omit for an icon-only button. */
  label: PropTypes.string,
  /** Font Awesome icon before the button text. */
  iconBefore: PropTypes.object,
  /** Font Awesome icon after the button text. */
  iconAfter: PropTypes.object,
  /** Optional click handler */
  onClick: PropTypes.func,
};

Button.defaultProps = {
  primary: false,
  variant: 'outline',
  inverse: false,
  size: 'medium',
  label: undefined,
  iconBefore: undefined,
  iconAfter: undefined,
  onClick: undefined,
};
