import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "number" | "select";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options?: Array<{ value: string; label: string }>;
}

export function FormField({ id, label, type = "text", value, onChange, placeholder, options }: FormFieldProps) {
  if (type === "select" && options) {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-[#4c1f03]">{label}</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id} className="border-[#4c1f03]/30 focus-visible:border-[#ff8d28]">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#4c1f03]">{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-[#4c1f03]/30 focus-visible:border-[#ff8d28]"
      />
    </div>
  );
}
