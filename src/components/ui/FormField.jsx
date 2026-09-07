/**
 * Label + control + help/error. Pass the control as children (add `className="input"`
 * yourself), or use TextInput / TextArea below.
 */
export default function FormField({ label, required, help, error, htmlFor, className = '', children }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="label">
          {label}
          {required && <span className="text-danger-fg ml-0.5">*</span>}
        </label>
      )}
      {children}
      {help && !error && <p className="help">{help}</p>}
      {error && (
        <p className="help text-danger-fg" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ error, className = '', ...rest }) {
  return <input className={`input ${error ? 'input-error' : ''} ${className}`} {...rest} />;
}

export function TextArea({ error, className = '', rows = 4, ...rest }) {
  return <textarea rows={rows} className={`input input-area ${error ? 'input-error' : ''} ${className}`} {...rest} />;
}

/** Label + input in one call — the shape most forms in this app need. */
export function Field({ label, required, help, error, id, name, className = '', ...rest }) {
  const htmlFor = id || name;
  return (
    <FormField label={label} required={required} help={help} error={error} htmlFor={htmlFor} className={className}>
      <TextInput id={htmlFor} name={name} error={error} {...rest} />
    </FormField>
  );
}
