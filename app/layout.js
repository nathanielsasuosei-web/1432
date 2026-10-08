import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/lib/AuthContext'
import { CartProvider } from '@/lib/CartContext'
import ToastProvider from '@/components/Toast'

export const metadata = {
  title: 'BeatForge — Premium Beats by Producers, for Artists',
  description: 'Buy and download high-quality beats. Pay with Mobile Money or Bank Transfer. Instant delivery via email.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
