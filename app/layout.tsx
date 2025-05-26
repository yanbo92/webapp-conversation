'use client'

import { useEffect } from 'react'
import { getLocaleOnClient } from '@/i18n/client'
import './styles/globals.css'
import './styles/markdown.scss'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize locale on client side
    getLocaleOnClient()
  }, [])

  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <div className="overflow-x-auto">
          <div className="w-screen h-screen min-w-[300px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
