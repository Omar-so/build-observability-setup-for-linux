import '@/app/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "next-themes"
import ReactQueryProvider from './ReactQueryProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ClerkProvider>
          <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </ReactQueryProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}