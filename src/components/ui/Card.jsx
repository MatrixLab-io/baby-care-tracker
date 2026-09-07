import { createElement } from 'react';

/**
 * Surface primitive. `lift` adds the hover raise; `inverse` is the dark CTA card.
 * `padding` is on by default — pass false when the card holds its own layout.
 */
export default function Card({
  as = 'div',
  lift = false,
  inverse = false,
  padding = true,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'card',
    lift && 'card-lift',
    inverse && 'card-inverse',
    padding && 'p-4 sm:p-6',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return createElement(as, { className: classes, ...rest }, children);
}
