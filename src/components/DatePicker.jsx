import { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  required = false,
  error = '',
  className = '',
  maxDate = null,
  minDate = null,
  ...props
}) => {
  const inputRef = useRef(null);
  const flatpickrRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      flatpickrRef.current = flatpickr(inputRef.current, {
        dateFormat: 'Y-m-d',
        maxDate: maxDate || new Date(),
        minDate: minDate,
        defaultDate: value || null,
        onChange: (selectedDates, dateStr) => {
          if (onChange) {
            // Create synthetic event
            const event = {
              target: {
                value: dateStr,
                name: props.name || 'date'
              }
            };
            onChange(event);
          }
        },
        theme: 'light'
      });
    }

    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
      }
    };
  }, [maxDate, minDate]);

  useEffect(() => {
    if (flatpickrRef.current && value) {
      flatpickrRef.current.setDate(value, false);
    }
  }, [value]);

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        required={required}
        className={`glass-card w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 cursor-pointer ${
          error ? 'ring-2 ring-red-500' : ''
        }`}
        readOnly
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;
