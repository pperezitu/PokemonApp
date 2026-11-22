export const capitalize = (value: string): string =>
    value.length === 0 ? value : value.charAt(0).toUpperCase() + value.slice(1);

export const capitalizeWords = (value: string): string =>
    value.split('-').map(capitalize).join(' ');