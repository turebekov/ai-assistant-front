'use client'

import { FONT_SIZES, type FontSizePx } from '@/lib/font-size'
import { cn } from '@/lib/utils'

interface FontSizePickerProps {
  value: FontSizePx
  onChange: (value: FontSizePx) => void
}

export function FontSizePicker({ value, onChange }: FontSizePickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-700">Font Size</label>
      <div className="grid grid-cols-4 gap-2">
        {FONT_SIZES.map((size) => {
          const selected = value === size
          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(size)}
              className={cn(
                'flex flex-col items-center justify-center rounded-lg border bg-white py-3 transition-colors',
                selected
                  ? 'border-primary ring-1 ring-primary/25'
                  : 'border-slate-200 hover:border-slate-300',
              )}
            >
              <span
                className="font-medium leading-none text-slate-800"
                style={{ fontSize: size }}
              >
                Aa
              </span>
              <span className="mt-2 text-xs text-slate-500">{size}px</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
