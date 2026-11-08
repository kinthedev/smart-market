import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'SmartMarket · Quản trị cửa hàng',
    description: 'Hệ thống quản trị thương mại điện tử SmartMarket',
    generator: 'SmartMarket',
    icons: {
        icon: [
            {
                url: '/icon-light-32x32.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/icon-dark-32x32.png',
                media: '(prefers-color-scheme: dark)',
            },
            {
                url: '/icon.svg',
                type: 'image/svg+xml',
            },
        ],
        apple: '/apple-icon.png',
    },
}

export const viewport: Viewport = {
    colorScheme: 'light dark',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="antialiased">
            {children}
            {process.env.NODE_ENV === 'production' && <Analytics />}
        </div>
    )
}
