'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { ReadingTrend } from '@/lib/types';

interface AverageSessionChartProps {
    data: ReadingTrend[];
    loading?: boolean;
    dailyAverage: number;
}

const chartConfig = {
    avgDuration: {
        label: 'Average Session Time',
        color: '#1f2937',
    },
} satisfies ChartConfig;

export function AverageSessionChart({ data, loading = false, dailyAverage }: AverageSessionChartProps) {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse">
                        <div className="h-[400px] bg-gray-200 rounded"></div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="animate-pulse flex gap-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </div>
                </CardFooter>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Average Session Time</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <p className="text-lg mb-2">📊</p>
                            <p className="font-medium">No reading session data available</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting the time range to see more data</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const chartData = data.map(item => ({
        month: item.fullMonthLabel || item.monthLabel,
        avgDuration: item.avgDuration,
        fullMonth: item.fullMonthLabel || `${item.monthLabel} ${item.year}`,
        totalSessions: item.totalSessions,
        uniqueUsers: item.uniqueUsersCount,
    }));

    // Check if all values are zero
    const allZeroValues = data.every(item => item.avgDuration === 0);

    const firstValue = data[0]?.avgDuration || 0;
    const lastValue = data[data.length - 1]?.avgDuration || 0;
    const trendPercentage = firstValue > 0 ? ((lastValue - firstValue) / firstValue * 100) : 0;
    const isPositiveTrend = trendPercentage > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    Average Session Time
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                    {dailyAverage} minutes/day • Last {data.length} months
                    {allZeroValues && data.length > 0 && ' (No recent data)'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="h-[400px] w-full"
                    style={{
                        top: 20,
                        left: 12,
                        right: 12,
                        bottom: 12,
                    }}
                >
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                            bottom: 12,
                        }}
                    >
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1f2937" stopOpacity={1} />
                                <stop offset="100%" stopColor="#6b7280" stopOpacity={0.8} />
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1f2937" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#1f2937" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            opacity={0.5}
                        />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={{ stroke: '#1f2937', strokeWidth: 1, strokeDasharray: '5 5' }}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name, props) => (
                                        <div className="flex flex-col gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {props.payload?.fullMonth}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                <span className="font-medium text-gray-900">{value} minutes</span> average session
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {props.payload?.totalSessions} sessions • {props.payload?.uniqueUsers} users
                                            </div>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <Line
                            dataKey="avgDuration"
                            type="monotone"
                            stroke="url(#lineGradient)"
                            strokeWidth={3}
                            fill="url(#areaGradient)"
                            dot={{
                                fill: "#1f2937",
                                strokeWidth: 2,
                                stroke: "#ffffff",
                                r: 5,
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                            }}
                            activeDot={{
                                r: 7,
                                fill: "#1f2937",
                                strokeWidth: 3,
                                stroke: "#ffffff",
                                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))"
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-gray-700"
                                fontSize={11}
                                fontWeight={500}
                                formatter={(value: number) => `${value}m`}
                            />
                        </Line>
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {allZeroValues ? (
                        <span className="text-gray-500">No recent activity</span>
                    ) : (
                        <>
                            {isPositiveTrend ? 'Trending up' : 'Trending down'} by {Math.abs(trendPercentage).toFixed(1)}%
                            <TrendingUp className={`h-4 w-4 ${isPositiveTrend ? 'text-green-600' : 'text-red-600 transform rotate-180'}`} />
                        </>
                    )}
                </div>
                <div className="text-muted-foreground leading-none">
                    {allZeroValues
                        ? `Showing ${data.length} months with no reading activity`
                        : `Showing average session time for the last ${data.length} months`
                    }
                </div>
            </CardFooter>
        </Card>
    );
}