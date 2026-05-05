export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    headerClassName?: string;
    cellClassName?: string;
    truncate?: boolean;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];

    // Sub-row support
    renderSubRow?: (item: T) => React.ReactNode;
    showIndex?: boolean;
    indexHeader?: string;

    // Search & Filter state from parent
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    onSearchSubmit?: () => void;
    onReset?: () => void;
    showToolbar?: boolean;
    showPagination?: boolean;
    pageSize?: number;
    isLoading?: boolean;
}
