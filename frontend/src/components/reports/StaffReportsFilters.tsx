'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon, FilterIcon } from 'lucide-react';
import { StaffReportsFiltersState } from '@/lib/types';

interface StaffReportsFiltersProps {
    filters: StaffReportsFiltersState;
    onFiltersChange: (filters: Partial<StaffReportsFiltersState>) => void;
    loading?: boolean;
}

export function StaffReportsFilters({ filters, onFiltersChange, loading = false }: StaffReportsFiltersProps) {
    const handleDateRangeChange = (dateRange: { range: { from: Date; to: Date | undefined } }) => {
        if (dateRange.range.from && dateRange.range.to) {
            onFiltersChange({
                startDate: dateRange.range.from.toISOString().split('T')[0],
                endDate: dateRange.range.to.toISOString().split('T')[0]
            });
        }
    };

    const handleMonthsBackChange = (value: string) => {
        onFiltersChange({ monthsBack: parseInt(value) });
    };

    const handleIntervalChange = (value: string) => {
        onFiltersChange({ interval: parseInt(value) });
    };

    const handleMostBorrowedLimitChange = (value: string) => {
        onFiltersChange({ mostBorrowedLimit: parseInt(value) });
    };

    const handleTopReadersLimitChange = (value: string) => {
        onFiltersChange({ topReadersLimit: parseInt(value) });
    };

    const resetFilters = () => {
        const defaultFilters: StaffReportsFiltersState = {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            monthsBack: 6,
            interval: 60,
            mostBorrowedLimit: 5,
            topReadersLimit: 10,
        };
        onFiltersChange(defaultFilters);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.monthsBack !== 6) count++;
        if (filters.interval !== 60) count++;
        if (filters.mostBorrowedLimit !== 5) count++;
        if (filters.topReadersLimit !== 10) count++;
        return count;
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <FilterIcon className="h-5 w-5 text-gray-500" />
                        <CardTitle className="text-lg font-semibold text-gray-900">
                            Filters
                        </CardTitle>
                        {getActiveFiltersCount() > 0 && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                {getActiveFiltersCount()} active
                            </span>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        disabled={loading}
                        className="flex items-center space-x-2"
                    >
                        <RefreshCwIcon className="h-4 w-4" />
                        <span>Reset</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Date Range */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Date Range
                        </Label>
                        <DateRangePicker
                            onUpdate={handleDateRangeChange}
                            initialDateFrom={filters.startDate}
                            initialDateTo={filters.endDate}
                            showCompare={false}
                        />
                    </div>

                    {/* Months Back */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Time Period
                        </Label>
                        <Select value={filters.monthsBack.toString()} onValueChange={handleMonthsBackChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select time period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3">Last 3 months</SelectItem>
                                <SelectItem value="6">Last 6 months</SelectItem>
                                <SelectItem value="12">Last 12 months</SelectItem>
                                <SelectItem value="24">Last 24 months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Interval */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Low Availability Interval
                        </Label>
                        <Select value={filters.interval.toString()} onValueChange={handleIntervalChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">Last 30 days</SelectItem>
                                <SelectItem value="60">Last 60 days</SelectItem>
                                <SelectItem value="90">Last 90 days</SelectItem>
                                <SelectItem value="180">Last 180 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Most Borrowed Limit */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Most Borrowed Limit
                        </Label>
                        <Select value={filters.mostBorrowedLimit.toString()} onValueChange={handleMostBorrowedLimitChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">Top 5</SelectItem>
                                <SelectItem value="10">Top 10</SelectItem>
                                <SelectItem value="15">Top 15</SelectItem>
                                <SelectItem value="20">Top 20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Top Readers Limit */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Top Readers Limit
                        </Label>
                        <Select value={filters.topReadersLimit.toString()} onValueChange={handleTopReadersLimitChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">Top 5</SelectItem>
                                <SelectItem value="10">Top 10</SelectItem>
                                <SelectItem value="15">Top 15</SelectItem>
                                <SelectItem value="20">Top 20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
