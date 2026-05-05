export interface DropdownOption {
    label: string;
    value: string | number;
}

export interface DropdownProps {
    options: DropdownOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    label?: string;
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    className?: string;
}
