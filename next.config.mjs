/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Block clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Legacy XSS filter (modern browsers ignore, older ones honour)
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Don't send full URL in Referer header to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser feature APIs
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
