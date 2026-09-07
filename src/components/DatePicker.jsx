import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import FormField from './ui/FormField';

/**
 * flatpickr behind the design system's `.input`. The calendar itself is
 * repainted with tokens in src/styles/flatpickr.css.
 */
const DatePicker = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Select date',
  required = false,
  error = '',
  help = '',
  className = '',
  maxDate = null,
  minDate = null,
  ...props
}) => {
  const inputRef = useRef(null);
  const flatpickrRef = useRef(null);
  const onChangeRef = useRef(onChange);

  // flatpickr keeps the callback it was built with, so the latest one lives in
  // a ref. Written in an effect, never during render.
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!inputRef.current) return undefined;

    flatpickrRef.current = flatpickr(inputRef.current, {
      dateFormat: 'Y-m-d',
      maxDate: maxDate || new Date(),
      minDate,
      defaultDate: value || null,
      disableMobile: true,
      onChange: (selectedDates, dateStr) => {
        onChangeRef.current?.({ target: { value: dateStr, name: name || 'date' } });
      },
    });

    return () => {
      flatpickrRef.current?.destroy();
    };
  }, [maxDate, minDate, name]);

  useEffect(() => {
    if (flatpickrRef.current && value) {
      flatpickrRef.current.setDate(value, false);
    }
  }, [value]);

  const id = name || 'date';

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      help={help}
      htmlFor={id}
      className={className}
    >
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          required={required}
          readOnly
          className={`input pr-10 cursor-pointer ${error ? 'input-error' : ''}`}
          {...props}
        />
        <CalendarDaysIcon
          className="w-[18px] h-[18px] text-ink-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </FormField>
  );
};

export default DatePicker;
