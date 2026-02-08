export default function SearchFilter({ value, onChange, placeholder }) {
  return (
    <input
      type="search"
      placeholder={placeholder || "Filter apps..."}
      className="input input-bordered input-sm w-full max-w-sm bg-base-100 font-body placeholder:text-base-content/30"
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={placeholder || "Filter apps"}
    />
  );
}
