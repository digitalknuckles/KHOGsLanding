export const metadata = {
  title: 'Your App',
  description: 'Animated Navigation App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>KHOGs&copy;</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
