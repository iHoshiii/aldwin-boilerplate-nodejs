/**
 * Input — reusable input field with label and error state
 */
export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
          ring-offset-white placeholder:text-slate-500 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50 transition-shadow
          ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
