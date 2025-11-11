import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(frontend)/core/components/atoms/Select/Select";

export interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  value: string;
  sortOptions: SortOption[];
  label: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SortSelect({
  value,
  sortOptions,
  label,
  onChange,
  className = "w-full sm:w-[200px]",
}: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
