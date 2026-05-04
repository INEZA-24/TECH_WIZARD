export const metadata = { title: 'Portfolio Admin' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, sans-serif', margin: 0, background: '#0a192f', color: '#e6f1ff' }}>
        {children}
      </body>
    </html>
  );
}
