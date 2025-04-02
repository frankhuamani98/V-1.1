// @/Components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      {...props}
      storageKey="motoparts-theme"
      enableSystem={false} // Deshabilitamos la detección automática del sistema
    >
      {children}
    </NextThemesProvider>
  )
}