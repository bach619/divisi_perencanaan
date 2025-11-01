import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "./auth-context"
import { ProposalProvider } from "@/components/proposal-context"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Divisi Perencanaan",
  description: "Aplikasi untuk manajemen proposal dan anggaran.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ProposalProvider>
            <AuthProvider>{children}</AuthProvider>
          </ProposalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}