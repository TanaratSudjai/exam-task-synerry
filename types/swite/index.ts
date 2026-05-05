export interface BaseSwitchProps {
    checked: boolean;
    onChange: (val: boolean) => void;
    label?: string;
    description?: string;
    activeColor?: 'blue' | 'emerald' | 'rose' | 'amber';
}
