import type { Metadata } from 'next'
import '@/app/global.css'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Sunflower:wght@300&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR&display=swap');

            @font-face {
              font-family: 'Sunflower', sans-serif;
              src: url('https://fonts.googleapis.com/css2?family=Grandiflora+One&family=IBM+Plex+Sans+KR&family=Sunflower:wght@300&display=swap') format("woff");
              unicode-range: U+0041-005A, U+0061-007A;
              font-style: normal;
            }
            @font-face {
              font-family: 'IBM Plex Sans KR';
              src: url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR&display=swap') format("woff");
              font-style: normal;
            }

            body {
              margin: 0;
              padding: 0;
              font-family: 'IBM Plex Sans KR', 'Sunflower', sans-serif;
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  )
}
