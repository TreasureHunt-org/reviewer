import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getModeFromLang(lang: string) {
    const normalizedLang = lang.toLowerCase().trim();
    switch (normalizedLang) {
        case 'java':
            return 'java';

        case 'python':
            return 'python';
        case 'c++':
        case 'c_cpp':
        case 'cpp':
            return 'c_cpp';

        default:
            return 'java';
    }
}