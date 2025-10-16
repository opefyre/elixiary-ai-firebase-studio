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
            background: #fafafa;
          }
          .swagger-ui {
            padding-top: 80px;
            max-width: 1200px;
            margin: 0 auto;
            padding-left: 20px;
            padding-right: 20px;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
