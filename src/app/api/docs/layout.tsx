export default function APIDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Elixiary AI API Documentation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          }
          .swagger-ui {
            padding-top: 20px;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
