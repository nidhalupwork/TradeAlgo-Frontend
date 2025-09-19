import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function roundUp(value: number, digits: number) {
  return Math.round(value * 10 ** digits) / 10 ** digits;
}
