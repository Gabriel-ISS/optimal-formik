import { AnyObject } from '@/helpers.types';

export function _getValue<T>(obj: AnyObject, path: string, nullOnError = false): T {
  const parts = path.split('.');

  for (const key of parts) {
    try {
      obj = obj[key]
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      if (nullOnError) return null as T
      throw new Error(`Invalid path in useField: path = "${path}", invalidKey = "${key}"`)
    }
  }

  return obj as T;
}

export function _setValue(obj: AnyObject, path: string, newValue?: unknown) {
  const parts = path.split('.');

  for (const key of parts) {
    if (!obj[key]) obj[key] = {}

    if (parts.at(-1) != key) {
      obj = obj[key]
    } else {
      obj[key] = newValue
    }
  }
}