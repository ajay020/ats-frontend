import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes safely — use this everywhere instead of template strings
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));