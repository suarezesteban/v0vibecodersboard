import React from "react"
import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

import './globals.css'

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'vibecoders.board',
  description: 'Find and hire vibecoders for your next project',
  openGraph: {
    title: 'vibecoders.board',
    description: 'Find and hire vibecoders for your next project',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'vibecoders.board',
    description: 'Find and hire vibecoders for your next project',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistMono.variable} font-mono antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
