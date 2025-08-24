import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ReadingAnalyticsLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full max-w-none px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-72 rounded" />
                            <Skeleton className="h-4 w-56 rounded" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-20 rounded" />
                        </div>
                    </div>
                    {/* View Mode Toggle Skeleton */}
                    <div className="mt-4">
                        <Skeleton className="h-10 w-64 rounded-lg" />
                    </div>
                </div>

                {/* Filters Skeleton */}
                <div className="mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <Skeleton className="h-5 w-32 rounded" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-24 rounded" />
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Skeleton className="h-8 w-40 rounded" />
                                <Skeleton className="h-8 w-32 rounded" />
                                <Skeleton className="h-8 w-48 rounded" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Most Highlighted Books */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-48 rounded" />
                            <Skeleton className="h-4 w-16 rounded" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
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
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Grid - Chart on Left, Top Books Table on Right */}
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                        {/* Left Column - Average Session Time Chart */}
                        <div className="xl:col-span-7">
                            <Card>
                                <div className="p-6">
                                    <div className="space-y-2 mb-4">
                                        <Skeleton className="h-6 w-48 rounded" />
                                        <Skeleton className="h-4 w-32 rounded" />
                                    </div>
                                    <Skeleton className="h-[250px] w-full rounded" />
                                    <div className="mt-4 space-y-2">
                                        <div className="flex gap-2">
                                            <Skeleton className="h-4 w-32 rounded" />
                                            <Skeleton className="h-4 w-4 rounded" />
                                        </div>
                                        <Skeleton className="h-3 w-48 rounded" />
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
                                            <Skeleton className="h-4 w-8 rounded" />
                                            <Skeleton className="h-4 w-32 rounded" />
                                            <Skeleton className="h-4 w-12 rounded" />
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
