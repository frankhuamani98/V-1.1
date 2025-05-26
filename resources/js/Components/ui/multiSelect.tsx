import * as React from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Selecciona uno o varios",
}) => {
    const handleToggle = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onChange(value.filter(v => v !== optionValue));
        } else {
            onChange([...value, optionValue]);
        }
    };

    return (
        <div className="border rounded-lg p-2 bg-white space-y-1">
            <div className="text-xs text-muted-foreground mb-1">{placeholder}</div>
            {options.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-muted transition">
                    <Checkbox
                        checked={value.includes(option.value)}
                        onCheckedChange={() => handleToggle(option.value)}
                        id={`multi-${option.value}`}
                    />
                    <Label htmlFor={`multi-${option.value}`} className="text-sm font-normal cursor-pointer">
                        {option.label}
                    </Label>
                </label>
            ))}
        </div>
    );
};
