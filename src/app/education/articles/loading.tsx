export default function LoadingArticlesArchive() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div className="h-10 w-40 rounded bg-muted animate-pulse" />
          <div className="h-6 w-28 rounded bg-muted animate-pulse" />
        </div>

        <div className="text-center mb-10 space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted animate-pulse" />
          <div className="mx-auto h-8 w-64 rounded bg-muted animate-pulse" />
          <div className="mx-auto h-5 w-80 rounded bg-muted animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="h-64 rounded-xl border border-border bg-muted/60 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
