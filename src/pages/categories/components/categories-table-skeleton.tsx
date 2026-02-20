const SKELETON_ROW_COUNT = 8;

export function CategoriesTableSkeleton() {
  const skeletonRows = [...Array(SKELETON_ROW_COUNT)];

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </th>
              <th className="px-4 py-3 text-left" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {skeletonRows.map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-6 w-16 bg-muted animate-pulse rounded-md" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
