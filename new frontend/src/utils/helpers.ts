/**
 * helpers.ts
 * Utility helper functions for the Task Management System frontend.
 */

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a date string to 'YYYY-MM-DD' format.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

/**
 * Truncates a string to a specified length and adds ellipsis if needed.
 * @param str - The string to truncate.
 * @param maxLength - Maximum length of the string.
 * @returns The truncated string.
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
}