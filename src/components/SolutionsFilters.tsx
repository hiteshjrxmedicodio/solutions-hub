const filterOptions = {
  department: ["Cardiology", "Oncology", "Pediatrics", "Radiology"],
  specialty: [
    "Chronic Care",
    "Surgical",
    "Behavioral Health",
    "Telehealth",
  ],
};

export function SolutionsFilters() {
  return (
    <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-4">
      <FilterSelect
        label="Department"
        name="department"
        options={filterOptions.department}
      />
      <FilterSelect
        label="Specialty"
        name="specialty"
        options={filterOptions.specialty}
      />
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  name: string;
  options: string[];
};

function FilterSelect({ label, name, options }: FilterSelectProps) {
  return (
    <label className="flex min-w-[140px] flex-[1_1_45%] flex-col gap-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
      <span>{label}</span>
      <div className="relative rounded-2xl bg-white/90 p-[2px] shadow-[0_10px_25px_-15px_rgba(15,23,42,0.7)] backdrop-blur">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-zinc-400">
          ●
        </span>
        <select
          name={name}
          className="w-full appearance-none rounded-[16px] border border-white/60 bg-gradient-to-r from-white to-zinc-50 px-7 py-1.5 text-sm font-semibold text-zinc-900 outline-none transition focus:border-zinc-300 focus:shadow-inner"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-500">
          ▾
        </span>
      </div>
    </label>
  );
}

