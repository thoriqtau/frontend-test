export default function SearchBar({ value = "", onSearch }) {
  return (
    <div
      role="search"
      aria-label="Search users by name or email"
      className="mb-2 w-full mt-10"
    >
      <div className="group relative flex h-12 w-full items-center border border-(--line-strong) bg-(--ink-3) transition-[border-color,box-shadow,color] duration-150 focus-within:ring-2 focus-within:ring-(--electric)">
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          className="pointer-events-none absolute left-3 size-4 text-(--bone-dim) transition-colors duration-150 group-focus-within:text-(--electric)"
        >
          <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="m10.25 10.25 3.25 3.25"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="square"
          />
        </svg>

        <input
          type="search"
          id="user-search"
          name="user-search"
          inputMode="search"
          autoComplete="off"
          aria-label="Search users"
          value={ value }
          onChange={ (event) => onSearch?.(event.target.value) }
          className="h-full min-w-0 flex-1 bg-transparent px-3 py-3 pl-10 text-sm leading-5 text-(--bone) outline-none placeholder:text-(--bone-dim) [&::-webkit-search-cancel-button]:hidden"
          placeholder="Search by name or email"
        />
      </div>
    </div>
  );
}
