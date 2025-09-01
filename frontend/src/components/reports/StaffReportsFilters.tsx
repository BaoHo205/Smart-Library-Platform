'use client';

import { useState, useEffect } from 'react';
import {
  Filter,
  Clock,
  Target,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { StaffReportsFiltersState } from '@/types/reports.type';
import { DateRange } from 'react-day-picker';
import toast from 'react-hot-toast';

interface StaffReportsFiltersProps {
  filters: StaffReportsFiltersState;
  onFiltersChange: (filters: Partial<StaffReportsFiltersState>) => void;
  loading?: boolean;
}

export function StaffReportsFilters({
  filters,
  onFiltersChange,
  loading = false,
}: StaffReportsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Initialize date range to default 6-month range
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    return {
      from: startDate,
      to: endDate,
    };
  });

  const [localMostBorrowedLimit, setLocalMostBorrowedLimit] = useState(
    filters.mostBorrowedLimit === 'max'
      ? 'max'
      : filters.mostBorrowedLimit.toString()
  );
  const [localTopReadersLimit, setLocalTopReadersLimit] = useState(
    filters.topReadersLimit.toString()
  );

  // Update local state when filters change externally
  useEffect(() => {
    if (filters.mostBorrowedLimit === 'max') {
      setLocalMostBorrowedLimit('max');
    } else {
      setLocalMostBorrowedLimit(filters.mostBorrowedLimit.toString());
    }
    setLocalTopReadersLimit(filters.topReadersLimit.toString());

    // Set date range based on filters
    if (filters.startDate && filters.endDate) {
      setDateRange({
        from: new Date(filters.startDate),
        to: new Date(filters.endDate),
      });
    }
  }, [
    filters.mostBorrowedLimit,
    filters.topReadersLimit,
    filters.startDate,
    filters.endDate,
  ]);

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    if (newDateRange?.from && newDateRange?.to) {
      onFiltersChange({
        startDate: newDateRange.from.toISOString().split('T')[0],
        endDate: newDateRange.to.toISOString().split('T')[0],
      });
      toast.success('Custom date range applied', {
        duration: 2000,
        icon: '📅',
        style: {
          background: '#3b82f6',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
        },
      });
    } else {
      // Reset to default 6-month range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      onFiltersChange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
    }
  };

  const handleMonthsBackChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ monthsBack: 'all' }); // Set to all time
      toast.success('Time period set to all time', {
        duration: 2000,
        icon: '⏰',
        style: {
          background: '#3b82f6',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
        },
      });
    } else {
      onFiltersChange({ monthsBack: parseInt(value) });
      toast.success(`Time period set to ${value} months`, {
        duration: 2000,
        icon: '📅',
        style: {
          background: '#3b82f6',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
        },
      });
    }

    // Note: The parent component will handle recalculating the date range
    // based on the new monthsBack value
  };

  const handleLowAvailabilityLimitChange = (value: string) => {
    onFiltersChange({ lowAvailabilityLimit: parseInt(value) });
    toast.success(`Low availability limit set to ${value} books`, {
      duration: 2000,
      icon: '📊',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '14px',
      },
    });
  };

  const handleMostBorrowedLimitChange = (value: string) => {
    setLocalMostBorrowedLimit(value);
    if (value === 'max') {
      onFiltersChange({ mostBorrowedLimit: 'max' });
      toast.success('Showing all most borrowed books', {
        duration: 2000,
        icon: '📚',
        style: {
          background: '#f59e0b',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
        },
      });
    } else {
      const limit = parseInt(value);
      if (!isNaN(limit) && limit > 0) {
        onFiltersChange({ mostBorrowedLimit: limit });
        toast.success(`Showing top ${limit} most borrowed books`, {
          duration: 2000,
          icon: '📚',
          style: {
            background: '#f59e0b',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
        });
      }
    }
  };

  const handleTopReadersLimitChange = (value: string) => {
    setLocalTopReadersLimit(value);
    const limit = parseInt(value);
    if (!isNaN(limit) && limit > 0) {
      onFiltersChange({ topReadersLimit: limit });
      toast.success(`Showing top ${limit} active readers`, {
        duration: 2000,
        icon: '👥',
        style: {
          background: '#8b5cf6',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
        },
      });
    }
  };

  const handleQuickLimitChange = (
    type: 'mostBorrowed' | 'topReaders',
    value: string
  ) => {
    if (value === 'max') {
      if (type === 'mostBorrowed') {
        onFiltersChange({ mostBorrowedLimit: 'max' });
        setLocalMostBorrowedLimit('max');
        toast.success('Showing all most borrowed books', {
          duration: 2000,
          icon: '📚',
          style: {
            background: '#f59e0b',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
        });
      } else {
        onFiltersChange({ topReadersLimit: 'max' });
        setLocalTopReadersLimit('max');
        toast.success('Showing all active readers', {
          duration: 2000,
          icon: '👥',
          style: {
            background: '#8b5cf6',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
        });
      }
    } else {
      const limit = parseInt(value);
      if (type === 'mostBorrowed') {
        onFiltersChange({ mostBorrowedLimit: limit });
        setLocalMostBorrowedLimit(limit.toString());
        toast.success(`Showing top ${limit} most borrowed books`, {
          duration: 2000,
          icon: '📚',
          style: {
            background: '#f59e0b',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
        });
      } else {
        onFiltersChange({ topReadersLimit: limit });
        setLocalTopReadersLimit(limit.toString());
        toast.success(`Showing top ${limit} active readers`, {
          duration: 2000,
          icon: '👥',
          style: {
            background: '#8b5cf6',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
          },
        });
      }
    }
  };

  const clearAllFilters = () => {
    // Calculate default date range for 6 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const defaultFilters: StaffReportsFiltersState = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      monthsBack: 6,
      lowAvailabilityLimit: 5,
      mostBorrowedLimit: 5,
      topReadersLimit: 10,
    };
    onFiltersChange(defaultFilters);
    setDateRange({
      from: startDate,
      to: endDate,
    });
    setLocalMostBorrowedLimit('5');
    setLocalTopReadersLimit('10');

    toast.success('All filters cleared', {
      duration: 2000,
      icon: '🧹',
      style: {
        background: '#6b7280',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '14px',
      },
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.monthsBack !== 6) count++;
    if (filters.lowAvailabilityLimit !== 5) count++;
    if (filters.mostBorrowedLimit !== 5) count++;
    if (filters.topReadersLimit !== 10) count++;

    // Check if custom date range is applied (not the calculated range from monthsBack)
    if (filters.monthsBack !== 'all') {
      const today = new Date();
      const calculatedStartDate = new Date();
      calculatedStartDate.setMonth(today.getMonth() - filters.monthsBack);
      const expectedStartDate = calculatedStartDate.toISOString().split('T')[0];
      const expectedEndDate = today.toISOString().split('T')[0];

      if (
        filters.startDate !== expectedStartDate ||
        filters.endDate !== expectedEndDate
      ) {
        count++;
      }
    }

    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  if (loading) {
    return (
      <div className="mb-8 w-full">
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8 w-full">
      <Card className="overflow-hidden border-gray-100 bg-white shadow-lg">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gray-900 p-3 shadow-sm">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Staff Reports Filters
                  </CardTitle>
                  <p className="mt-1 text-sm text-gray-600">
                    Filter staff reports data
                  </p>
                </div>
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="default"
                    className="bg-gray-900 px-3 py-1 text-white"
                  >
                    {activeFiltersCount} active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reset
                  </Button>
                )}
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Advanced
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4" />
                        Advanced Filters
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Quick Filters - Always Visible */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Quick Time Period */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4" />
                  Time Period
                </Label>
                <Select
                  value={filters.monthsBack.toString()}
                  onValueChange={handleMonthsBackChange}
                >
                  <SelectTrigger className="border-gray-200 bg-white transition-colors hover:border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Last 3 months</SelectItem>
                    <SelectItem value="6">Last 6 months</SelectItem>
                    <SelectItem value="12">Last 12 months</SelectItem>
                    <SelectItem value="24">Last 24 months</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {filters.monthsBack === 'all'
                    ? 'Reports data from first to last available'
                    : `Reports data from the last ${filters.monthsBack} months`}
                </p>
              </div>

              {/* Quick Low Availability Limit */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Target className="h-4 w-4" />
                  Low Availability Limit
                </Label>
                <Select
                  value={(filters.lowAvailabilityLimit || 5).toString()}
                  onValueChange={handleLowAvailabilityLimitChange}
                >
                  <SelectTrigger className="border-gray-200 bg-white transition-colors hover:border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Top 5 Books</SelectItem>
                    <SelectItem value="10">Top 10 Books</SelectItem>
                    <SelectItem value="15">Top 15 Books</SelectItem>
                    <SelectItem value="20">Top 20 Books</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Number of low availability books to show
                </p>
              </div>

              {/* Quick Most Borrowed Limit */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Target className="h-4 w-4" />
                  Most Borrowed Limit
                </Label>
                <Select
                  value={localMostBorrowedLimit}
                  onValueChange={value =>
                    handleQuickLimitChange('mostBorrowed', value)
                  }
                >
                  <SelectTrigger className="border-gray-200 bg-white transition-colors hover:border-gray-300">
                    <SelectValue>
                      {localMostBorrowedLimit === 'max'
                        ? 'Max (See all)'
                        : `Top ${localMostBorrowedLimit} Books`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Top 5 Books</SelectItem>
                    <SelectItem value="10">Top 10 Books</SelectItem>
                    <SelectItem value="15">Top 15 Books</SelectItem>
                    <SelectItem value="20">Top 20 Books</SelectItem>
                    <SelectItem value="max">Max (See all)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Number of top most borrowed books
                </p>
              </div>

              {/* Quick Top Readers Limit */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Target className="h-4 w-4" />
                  Top Readers Limit
                </Label>
                <Select
                  value={localTopReadersLimit}
                  onValueChange={value =>
                    handleQuickLimitChange('topReaders', value)
                  }
                >
                  <SelectTrigger className="border-gray-200 bg-white transition-colors hover:border-gray-300">
                    <SelectValue>
                      {localTopReadersLimit === 'max'
                        ? 'Max (See all)'
                        : `Top ${localTopReadersLimit} Readers`}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Top 5 Readers</SelectItem>
                    <SelectItem value="10">Top 10 Readers</SelectItem>
                    <SelectItem value="15">Top 15 Readers</SelectItem>
                    <SelectItem value="20">Top 20 Readers</SelectItem>
                    <SelectItem value="max">Max (See all)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Number of top active readers
                </p>
              </div>
            </div>
          </CardHeader>

          {/* Advanced Filters - Collapsible */}
          <CollapsibleContent>
            <CardContent className="border-t border-gray-100 bg-gray-50 pt-6 pb-8">
              <div className="space-y-6">
                <div className="mb-4 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-800">
                    Advanced Options
                  </h3>
                </div>

                {/* All Advanced Options in One Row */}
                <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                  {/* Advanced Date Range */}
                  <Card className="flex-1 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
                    <CardContent className="p-4">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <Label className="text-sm font-semibold text-gray-800">
                          Custom Date Range
                        </Label>
                      </div>
                      <div className="w-full">
                        <DateRangePicker
                          initialDateFrom={dateRange?.from}
                          initialDateTo={dateRange?.to}
                          onUpdate={values =>
                            handleDateRangeChange(values.range)
                          }
                          align="start"
                          showCompare={false}
                        />
                      </div>
                      <p className="mt-3 text-xs text-gray-500">
                        Override the time period with a specific date range
                      </p>
                    </CardContent>
                  </Card>

                  {/* Advanced Result Limits */}
                  <Card className="flex-1 border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white">
                    <CardContent className="p-4">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex-shrink-0 rounded-lg bg-orange-100 p-2">
                          <Target className="h-4 w-4 text-orange-600" />
                        </div>
                        <Label className="text-sm font-semibold whitespace-nowrap text-gray-800">
                          Custom Result Limits
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <Label className="mb-2 block text-xs text-gray-600">
                            Most Borrowed Books
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="9999"
                            value={
                              localMostBorrowedLimit === 'max'
                                ? ''
                                : localMostBorrowedLimit
                            }
                            onChange={e =>
                              setLocalMostBorrowedLimit(e.target.value)
                            }
                            onBlur={() =>
                              handleMostBorrowedLimitChange(
                                localMostBorrowedLimit
                              )
                            }
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                handleMostBorrowedLimitChange(
                                  localMostBorrowedLimit
                                );
                              }
                            }}
                            className="h-9 border-gray-200 bg-white transition-colors hover:border-gray-300"
                            placeholder="Enter number or 'max' for all"
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block text-xs text-gray-600">
                            Top Active Readers
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="9999"
                            value={
                              localTopReadersLimit === 'max'
                                ? ''
                                : localTopReadersLimit
                            }
                            onChange={e =>
                              setLocalTopReadersLimit(e.target.value)
                            }
                            onBlur={() =>
                              handleTopReadersLimitChange(localTopReadersLimit)
                            }
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                handleTopReadersLimitChange(
                                  localTopReadersLimit
                                );
                              }
                            }}
                            className="h-9 border-gray-200 bg-white transition-colors hover:border-gray-300"
                            placeholder="Enter number or 'max' for all"
                          />
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-gray-500">
                        Type a custom number and press Enter or click outside to
                        apply
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>

          {/* active filters summary */}
          {activeFiltersCount > 0 && (
            <CardContent className="border-t border-gray-100 pt-4 pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Active filters:
                </span>
                {filters.monthsBack !== 6 && (
                  <Badge
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    {filters.monthsBack === 'all'
                      ? 'All time'
                      : `${filters.monthsBack} months`}
                  </Badge>
                )}
                {filters.lowAvailabilityLimit !== 5 && (
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700 transition-colors hover:bg-green-100"
                  >
                    Top {filters.lowAvailabilityLimit} low availability books
                  </Badge>
                )}
                {filters.mostBorrowedLimit !== 5 && (
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-50 text-orange-700 transition-colors hover:bg-orange-100"
                  >
                    Top{' '}
                    {filters.mostBorrowedLimit === 'max'
                      ? 'Max'
                      : filters.mostBorrowedLimit}{' '}
                    most borrowed
                  </Badge>
                )}
                {filters.topReadersLimit !== 10 && (
                  <Badge
                    variant="outline"
                    className="border-purple-200 bg-purple-50 text-purple-700 transition-colors hover:bg-purple-100"
                  >
                    Top{' '}
                    {filters.topReadersLimit === 'max'
                      ? 'Max'
                      : filters.topReadersLimit}{' '}
                    readers
                  </Badge>
                )}

                {(() => {
                  if (filters.monthsBack !== 'all') {
                    const today = new Date();
                    const calculatedStartDate = new Date();
                    calculatedStartDate.setMonth(
                      today.getMonth() - filters.monthsBack
                    );
                    const expectedStartDate = calculatedStartDate
                      .toISOString()
                      .split('T')[0];
                    const expectedEndDate = today.toISOString().split('T')[0];

                    if (
                      filters.startDate &&
                      filters.endDate &&
                      (filters.startDate !== expectedStartDate ||
                        filters.endDate !== expectedEndDate)
                    ) {
                      const startDate = new Date(filters.startDate);
                      const endDate = new Date(filters.endDate);
                      const isSameDay =
                        startDate.toDateString() === endDate.toDateString();

                      return (
                        <Badge
                          variant="outline"
                          className="border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100"
                        >
                          {isSameDay
                            ? startDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : `${startDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })} - ${endDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}`}
                        </Badge>
                      );
                    }
                  }
                  return null;
                })()}
              </div>
            </CardContent>
          )}
        </Collapsible>
      </Card>
    </div>
  );
}
