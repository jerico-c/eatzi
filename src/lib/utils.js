// src/lib/utils.js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Mengubah teks menjadi format "slug" yang ramah URL.
 * @param {string} text Teks yang akan di-slugify.
 * @param {object} [options] Opsi tambahan.
 * @param {boolean} [options.lower=true] Apakah akan mengubah output menjadi huruf kecil.
 * @param {boolean} [options.strict=true] Apakah akan menghapus tanda hubung di awal/akhir.
 * @returns {string} Teks dalam format slug.
 */
export function slugify(text, options = {}) {
  if (typeof text !== 'string') {
    // Anda bisa uncomment baris di bawah untuk logging jika input bukan string
    // console.warn('Slugify: input is not a string, returning empty string.');
    return '';
  }

  const { lower = true, strict = true } = options;

  let str = text.toString();

  if (lower) {
    str = str.toLowerCase();
  }

  str = str
    .trim() // Hapus spasi di awal dan akhir
    .replace(/\s+/g, '-') // Ganti satu atau lebih spasi dengan tanda hubung (-)
    .replace(/[^\w-]+/g, '') // Hapus semua karakter non-word (alphanumeric & underscore) dan non-tanda hubung
    .replace(/--+/g, '-'); // Ganti beberapa tanda hubung berurutan menjadi satu

  if (strict) {
    str = str.replace(/^-+|-+$/g, ''); // Hapus tanda hubung yang mungkin ada di awal atau akhir string
  }

  return str;
}