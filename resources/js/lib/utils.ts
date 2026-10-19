import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

const ZERO_DECIMAL_CURRENCIES = new Set([
    'BIF',
    'CLP',
    'DJF',
    'GNF',
    'JPY',
    'KMF',
    'KRW',
    'PYG',
    'RWF',
    'UGX',
    'VND',
    'VUV',
    'XAF',
    'XOF',
    'XPF',
]);

export function formatCurrency(
    value: number | string | null | undefined,
    currency = 'XAF',
    locale = 'fr-CM',
): string {
    const amount =
        typeof value === 'string' ? Number.parseFloat(value) : (value ?? 0);

    if (!Number.isFinite(amount)) {
        return '';
    }

    const zeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase());

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: zeroDecimal ? 0 : 2,
        maximumFractionDigits: zeroDecimal ? 0 : 2,
    }).format(amount);
}

export function formatNumber(
    value: number | string | null | undefined,
): string {
    const amount =
        typeof value === 'string' ? Number.parseFloat(value) : (value ?? 0);

    if (!Number.isFinite(amount)) {
        return '0';
    }

    return new Intl.NumberFormat('en-US').format(amount);
}

export function formatDate(value: string | Date | null | undefined): string {
    if (!value) {
        return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

export function titleCase(value: string): string {
    return value
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export type Tone =
    'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'clay';

const ORDER_STATUS_TONES: Record<string, Tone> = {
    new: 'info',
    processing: 'warning',
    shipped: 'clay',
    delivered: 'success',
    cancelled: 'danger',
};

const PAYMENT_STATUS_TONES: Record<string, Tone> = {
    pending: 'warning',
    paid: 'success',
    failed: 'danger',
    refunded: 'neutral',
};

export function orderStatusTone(status: string): Tone {
    return ORDER_STATUS_TONES[status] ?? 'neutral';
}

export function paymentStatusTone(status: string): Tone {
    return PAYMENT_STATUS_TONES[status] ?? 'neutral';
}

export function orderStatusLabel(status: string): string {
    return status === 'cancelled' ? 'Cancelled' : titleCase(status);
}

export function paymentStatusLabel(status: string): string {
    return titleCase(status);
}

export function initials(name: string | null | undefined): string {
    if (!name) {
        return '?';
    }

    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
}
