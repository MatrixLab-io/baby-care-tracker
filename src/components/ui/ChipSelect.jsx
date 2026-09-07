import { CheckIcon } from '@heroicons/react/20/solid';

/**
 * Pill-style single select — the design system's answer to a dropdown.
 * `options` may be strings or {id,label,icon}. `value` is the option id.
 * Selecting the active option again clears it when `clearable`.
 */
export default function ChipSelect({
  label,
  labelIcon: LabelIcon,
  required,
  help,
  error,
  options,
  value,
  onChange,
  clearable = false,
  columns,
  className = '',
}) {
  const items = options.map((o) => (typeof o === 'string' ? { id: o, label: o } : o));
  const layout = columns ? `grid gap-2 ${columns}` : 'flex flex-wrap gap-2';

  return (
    <div className={className}>
      {label && (
        <span className="label inline-flex items-center gap-1.5">
          {LabelIcon && <LabelIcon className="w-4 h-4 text-ink-2" />}
          {label}
          {required && <span className="text-danger-fg ml-0.5">*</span>}
        </span>
      )}
      <div className={layout} role="radiogroup" aria-label={label}>
        {items.map((item) => {
          const selected = value === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(clearable && selected ? '' : item.id)}
              className={`chip justify-center ${selected ? 'chip-on' : ''}`}
            >
              {selected ? (
                <CheckIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              ) : (
                Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              {item.label}
            </button>
          );
        })}
      </div>
      {help && !error && <p className="help">{help}</p>}
      {error && (
        <p className="help text-danger-fg" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
