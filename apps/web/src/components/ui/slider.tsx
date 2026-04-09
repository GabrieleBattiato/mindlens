"use client"

import { cn } from "@/lib/utils"

interface SliderProps {
  className?: string
  min?: number
  max?: number
  step?: number
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  disabled?: boolean
}

function Slider({
  className,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  disabled,
}: SliderProps) {
  const currentValue = value?.[0] ?? defaultValue?.[0] ?? min

  return (
    <div className={cn("relative flex w-full touch-none items-center select-none", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={disabled}
        onChange={(e) => onValueChange?.([Number(e.target.value)])}
        className="
          w-full h-1 appearance-none cursor-pointer rounded-full bg-muted
          disabled:opacity-50 disabled:cursor-not-allowed
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:border
          [&::-webkit-slider-thumb]:border-ring
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow-sm
          [&::-webkit-slider-thumb]:transition-shadow
          [&::-webkit-slider-thumb]:hover:ring-3
          [&::-webkit-slider-thumb]:hover:ring-ring/50
          [&::-moz-range-thumb]:h-3
          [&::-moz-range-thumb]:w-3
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border
          [&::-moz-range-thumb]:border-ring
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-track]:rounded-full
          [&::-moz-range-track]:bg-muted
        "
      />
    </div>
  )
}

export { Slider }
