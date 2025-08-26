import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function StaffReportsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-none px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 rounded" />
              <Skeleton className="h-4 w-80 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24 rounded" />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Most Borrowed Books */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="relative">
                  <CardContent className="p-4">
                    <div className="absolute top-3 left-3 z-10">
                      <Skeleton className="h-5 w-12 rounded" />
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <Skeleton className="h-5 w-12 rounded" />
                    </div>
                    <Skeleton className="mb-3 aspect-[3/4] w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full rounded" />
                      <Skeleton className="h-3 w-3/4 rounded" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-4 w-16 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            {/* Left Column - Low Availability Chart */}
            <div className="xl:col-span-7">
              <Card>
                <div className="p-6">
                  <div className="mb-4 space-y-2">
                    <Skeleton className="h-6 w-48 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>

                  {/* Low availability books list skeleton */}
                  <div className="mb-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-3/4 rounded" />
                            <Skeleton className="h-3 w-1/2 rounded" />
                            <Skeleton className="h-3 w-1/3 rounded" />
                          </div>
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-4 w-12 rounded" />
                          <Skeleton className="h-3 w-20 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="mb-6 border-gray-200" />

                  {/* Bar chart skeleton */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <Skeleton className="h-4 w-8 rounded" />
                            <Skeleton className="h-4 w-12 rounded" />
                          </div>
                          <div className="h-3 w-full rounded-full bg-gray-200">
                            <Skeleton
                              className="h-3 rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="xl:col-span-5">
              <Card className="h-fit">
                <div className="p-6 pb-0">
                  <Skeleton className="mb-6 h-6 w-48 rounded" />
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24 rounded" />
                          <Skeleton className="h-3 w-16 rounded" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
