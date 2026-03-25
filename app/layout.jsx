import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '600', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata = {
  title: 'ResumeMax — ATS Resume Analyzer',
  description:
    'Upload your resume and any job description. Get your ATS keyword score, missing skills, and AI-rewritten bullet points in seconds.',
  keywords: 'ATS resume checker, resume keywords, job application, resume analyzer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn(fraunces.variable, dmSans.variable)}>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
