'use client';

import { useState, useEffect } from 'react';
import { Filter, Clock, MonitorSpeaker, Target, X, ChevronDown, ChevronUp, User, Settings, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DateRangePicker } from '@/components/ui/date-range-picker';

import { AnalyticsFiltersState, DeviceType } from '@/lib/types';
import { useUserSearch, UserSearchResult } from '@/hooks/useUserSearch';

import { DateRange } from 'react-day-picker';
import toast from 'react-hot-toast';

interface AnalyticsFiltersProps {
    filters: AnalyticsFiltersState;
    onFiltersChange: (filters: Partial<AnalyticsFiltersState>) => void;
    loading?: boolean;
    viewMode?: 'personal' | 'platform';
}

export function AnalyticsFilters({ filters, onFiltersChange, loading = false, viewMode = 'personal' }: AnalyticsFiltersProps) {
    const [userSearchInput, setUserSearchInput] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
    const [userSearchOpen, setUserSearchOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(filters.dateRange);

    const [localHighlightedLimit, setLocalHighlightedLimit] = useState(filters.highlightedBooksLimit.toString());
    const [localTopBooksLimit, setLocalTopBooksLimit] = useState(filters.topBooksLimit.toString());


    const { users, loading: usersLoading } = useUserSearch(viewMode === 'platform' ? userSearchInput : '');

    useEffect(() => {
        if (viewMode === 'platform' && filters.userId && !selectedUser) {
            const user = users.find(u => u.id === filters.userId);
            if (user) {
                setSelectedUser(user);
            }
        }
    }, [filters.userId, users, selectedUser, viewMode]);

    // Update local state when filters change externally
    useEffect(() => {
        if (filters.highlightedBooksLimit === 9999) {
            setLocalHighlightedLimit('max');
        } else {
            setLocalHighlightedLimit(filters.highlightedBooksLimit.toString());
        }

        if (filters.topBooksLimit === 9999) {
            setLocalTopBooksLimit('max');
        } else {
            setLocalTopBooksLimit(filters.topBooksLimit.toString());
        }
    }, [filters.highlightedBooksLimit, filters.topBooksLimit]);

    useEffect(() => {
        if (viewMode === 'personal' && filters.userId) {
            onFiltersChange({ userId: undefined });
            setSelectedUser(null);
            setUserSearchInput('');
        }
    }, [viewMode, filters.userId, onFiltersChange]);

    const handleMonthsChange = (value: string) => {
        if (value === 'max') {
            // Set a special value to represent "all time" - backend will handle this
            onFiltersChange({ months: 'all', dateRange: undefined });
            toast.success('Time range set to all time', {
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
            onFiltersChange({ months: parseInt(value), dateRange: undefined });
            toast.success(`Time range set to ${value} months`, {
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
        setDateRange(undefined);
    };

    const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
        setDateRange(newDateRange);
        if (newDateRange?.from && newDateRange?.to) {
            onFiltersChange({
                dateRange: { from: newDateRange.from, to: newDateRange.to },
                months: undefined
            });
        } else {
            onFiltersChange({ dateRange: undefined });
        }
    };

    const handleDeviceTypeChange = (value: string) => {
        onFiltersChange({ deviceType: value as 'all' | DeviceType });
        if (value === 'all') {
            toast.success('Showing all device types', {
                duration: 2000,
                icon: '💻',
                style: {
                    background: '#10b981',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                },
            });
        } else {
            toast.success(`Filtering by ${value} devices`, {
                duration: 2000,
                icon: '📱',
                style: {
                    background: '#10b981',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                },
            });
        }
    };

    const handleUserSelect = (user: UserSearchResult | null) => {
        // Only allow user selection in platform mode
        if (viewMode !== 'platform') {
            return;
        }

        setSelectedUser(user);
        onFiltersChange({ userId: user?.id });
        setUserSearchOpen(false);
        setUserSearchInput('');

        if (user) {
            toast.success(`Filtering analytics for ${user.displayName}`, {
                duration: 2000,
                icon: '👤',
                style: {
                    background: '#8b5cf6',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                },
            });
        } else {
            toast.success('Showing analytics for all users', {
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

    const handleHighlightedLimitChange = (value: string) => {
        setLocalHighlightedLimit(value);
        const limit = parseInt(value);
        if (!isNaN(limit) && limit > 0) {
            onFiltersChange({ highlightedBooksLimit: limit });
            toast.success(`Showing top ${limit} highlighted books`, {
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
    };

    const handleTopBooksLimitChange = (value: string) => {
        setLocalTopBooksLimit(value);
        const limit = parseInt(value);
        if (!isNaN(limit) && limit > 0) {
            onFiltersChange({ topBooksLimit: limit });
            toast.success(`Showing top ${limit} books by reading time`, {
                duration: 2000,
                icon: '⏱️',
                style: {
                    background: '#f59e0b',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                },
            });
        }
    };

    const handleQuickLimitChange = (type: 'highlighted' | 'topBooks', value: string) => {
        if (value === 'max') {
            const limit = 9999;
            onFiltersChange({
                [type === 'highlighted' ? 'highlightedBooksLimit' : 'topBooksLimit']: limit
            });
            // Keep "max" in local state for display purposes
            if (type === 'highlighted') {
                setLocalHighlightedLimit('max');
                toast.success('Showing all highlighted books', {
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
                setLocalTopBooksLimit('max');
                toast.success('Showing all books by reading time', {
                    duration: 2000,
                    icon: '⏱️',
                    style: {
                        background: '#f59e0b',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '14px',
                    },
                });
            }
        } else {
            const limit = parseInt(value);
            onFiltersChange({
                [type === 'highlighted' ? 'highlightedBooksLimit' : 'topBooksLimit']: limit
            });
            if (type === 'highlighted') {
                setLocalHighlightedLimit(limit.toString());
                toast.success(`Showing top ${limit} highlighted books`, {
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
                setLocalTopBooksLimit(limit.toString());
                toast.success(`Showing top ${limit} books by reading time`, {
                    duration: 2000,
                    icon: '⏱️',
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

    const clearAllFilters = () => {
        onFiltersChange({
            months: 6,
            dateRange: undefined,
            deviceType: 'all',
            userId: undefined,
            highlightedBooksLimit: 5,
            topBooksLimit: 10
        });
        setSelectedUser(null);
        setUserSearchInput('');
        setDateRange(undefined);
        setLocalHighlightedLimit('5');
        setLocalTopBooksLimit('10');

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
        if (filters.months !== 6 && filters.months !== undefined) count++;
        if (filters.dateRange) count++;
        if (filters.deviceType !== 'all') count++;
        if (filters.userId && viewMode === 'platform') count++;
        if (filters.highlightedBooksLimit !== 5) count++;
        if (filters.topBooksLimit !== 10) count++;
        return count;
    };

    const activeFiltersCount = getActiveFiltersCount();

    if (loading) {
        return (
            <div className="w-full mb-8">
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full mb-8">
            <Card className="border-gray-100 shadow-lg bg-white overflow-hidden">
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-900 rounded-xl shadow-sm">
                                    <Filter className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">
                                        Analytics Filters
                                    </CardTitle>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Filter reading analytics data
                                    </p>
                                </div>
                                {activeFiltersCount > 0 && (
                                    <Badge variant="default" className="bg-gray-900 text-white px-3 py-1">
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
                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="h-4 w-4 mr-1" />
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                            {/* Quick Time Range */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Time Range
                                </Label>
                                <Select value={filters.months === 'all' ? "max" : (filters.months?.toString() || "6")} onValueChange={handleMonthsChange}>
                                    <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Last 1 month</SelectItem>
                                        <SelectItem value="3">Last 3 months</SelectItem>
                                        <SelectItem value="6">Last 6 months</SelectItem>
                                        <SelectItem value="12">Last 12 months</SelectItem>
                                        <SelectItem value="24">Last 2 years</SelectItem>
                                        <SelectItem value="max">Max (All time)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">
                                    {filters.months === 'all' ? 'Reading data from first to last available' : `Reading data from the last ${filters.months || 6} months`}
                                </p>
                            </div>

                            {/* Quick Device Filter */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <MonitorSpeaker className="h-4 w-4" />
                                    Device Type
                                </Label>
                                <Select value={filters.deviceType} onValueChange={handleDeviceTypeChange}>
                                    <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Devices</SelectItem>
                                        <SelectItem value="mobile">📱 Mobile</SelectItem>
                                        <SelectItem value="tablet">📱 Tablet</SelectItem>
                                        <SelectItem value="desktop">💻 Desktop</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">
                                    Filter by reading device type
                                </p>
                            </div>

                            {/* Quick Highlighted Books Limit */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    Top Highlighted
                                </Label>
                                <Select
                                    value={localHighlightedLimit}
                                    onValueChange={(value) => handleQuickLimitChange('highlighted', value)}
                                >
                                    <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                                        <SelectValue>
                                            {localHighlightedLimit === 'max' ? 'Max (See all)' : `Top ${localHighlightedLimit} Books`}
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
                                    Number of top highlighted books
                                </p>
                            </div>

                            {/* Quick Top Books Limit */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    Top by Time
                                </Label>
                                <Select
                                    value={localTopBooksLimit}
                                    onValueChange={(value) => handleQuickLimitChange('topBooks', value)}
                                >
                                    <SelectTrigger className="bg-white border-gray-200 hover:border-gray-300 transition-colors">
                                        <SelectValue>
                                            {localTopBooksLimit === 'max' ? 'Max (See all)' : `Top ${localTopBooksLimit} Books`}
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
                                    Number of top books by reading time
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Advanced Filters - Collapsible */}
                    <CollapsibleContent>
                        <CardContent className="pt-6 pb-8 bg-gray-50 border-t border-gray-100">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Settings className="h-4 w-4 text-gray-600" />
                                    <h3 className="text-sm font-semibold text-gray-800">Advanced Options</h3>
                                </div>

                                {/* All Advanced Options in One Row */}
                                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                                    {/* Advanced Date Range */}
                                    <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white flex-1">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-blue-100 rounded-lg">
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
                                                    onUpdate={(values) => handleDateRangeChange(values.range)}
                                                    align="start"
                                                    showCompare={false}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-3">
                                                Override the time range with a specific date range
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* user search - for platform analytics */}
                                    {viewMode === 'platform' && (
                                        <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white flex-1">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-purple-100 rounded-lg">
                                                        <User className="h-4 w-4 text-purple-600" />
                                                    </div>
                                                    <Label className="text-sm font-semibold text-gray-800">
                                                        Specific User Filter
                                                    </Label>
                                                </div>

                                                <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={userSearchOpen}
                                                            className="w-full justify-between bg-white hover:bg-gray-50 transition-colors"
                                                        >
                                                            {selectedUser ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar className="h-5 w-5">
                                                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                                                            {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                                                                        </div>
                                                                    </Avatar>
                                                                    <span className="truncate">{selectedUser.userName}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500">Select user...</span>
                                                            )}
                                                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80 p-0" side="bottom" align="start">
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Search users by name, username, or ID..."
                                                                value={userSearchInput}
                                                                onValueChange={setUserSearchInput}
                                                            />
                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    {usersLoading ? "Loading users..." : "No users found."}
                                                                </CommandEmpty>
                                                                {!usersLoading && (
                                                                    <CommandGroup>
                                                                        <CommandItem
                                                                            key="clear"
                                                                            onSelect={() => handleUserSelect(null)}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <X className="mr-2 h-4 w-4" />
                                                                            Clear selection
                                                                        </CommandItem>
                                                                        <Separator className="my-1" />
                                                                        {users.map((user) => (
                                                                            <CommandItem
                                                                                key={user.id}
                                                                                value={`${user.userName} ${user.firstName} ${user.lastName} ${user.email} ${user.id}`}
                                                                                onSelect={() => handleUserSelect(user)}
                                                                                className="cursor-pointer"
                                                                            >
                                                                                <div className="flex items-center gap-3 w-full">
                                                                                    <Avatar className="h-8 w-8">
                                                                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-medium text-white">
                                                                                            {user.firstName[0]}{user.lastName[0]}
                                                                                        </div>
                                                                                    </Avatar>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                                                            {user.displayName}
                                                                                        </p>
                                                                                        <p className="text-xs text-gray-500 truncate">
                                                                                            @{user.userName} • {user.email}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                )}
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>

                                                <p className="text-xs text-gray-500 mt-3">
                                                    Filter analytics for a specific user (staff only)
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Advanced Result Limits */}
                                    <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white flex-1">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                                                    <Target className="h-4 w-4 text-orange-600" />
                                                </div>
                                                <Label className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                                                    Custom Result Limits
                                                </Label>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-xs text-gray-600 mb-2 block">Top Highlighted Books</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="9999"
                                                        value={localHighlightedLimit === 'max' ? '' : localHighlightedLimit}
                                                        onChange={(e) => setLocalHighlightedLimit(e.target.value)}
                                                        onBlur={() => handleHighlightedLimitChange(localHighlightedLimit)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleHighlightedLimitChange(localHighlightedLimit);
                                                            }
                                                        }}
                                                        className="bg-white border-gray-200 h-9 hover:border-gray-300 transition-colors"
                                                        placeholder="Enter number or 'max' for all"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-gray-600 mb-2 block">Top Books by Time</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="9999"
                                                        value={localTopBooksLimit === 'max' ? '' : localTopBooksLimit}
                                                        onChange={(e) => setLocalTopBooksLimit(e.target.value)}
                                                        onBlur={() => handleTopBooksLimitChange(localTopBooksLimit)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleTopBooksLimitChange(localTopBooksLimit);
                                                            }
                                                        }}
                                                        className="bg-white border-gray-200 h-9 hover:border-gray-300 transition-colors"
                                                        placeholder="Enter number or 'max' for all"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-3">
                                                Type a custom number and press Enter or click outside to apply
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </CollapsibleContent>

                    {/* active filters summary */}
                    {activeFiltersCount > 0 && (
                        <CardContent className="pt-4 pb-6 border-t border-gray-100">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                                {filters.months !== 6 && filters.months !== undefined && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                                        {filters.months === 'all' ? 'Max' : `${filters.months} months`}
                                    </Badge>
                                )}
                                {filters.dateRange && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                                        Custom date range
                                    </Badge>
                                )}
                                {filters.deviceType !== 'all' && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors">
                                        {filters.deviceType} device
                                    </Badge>
                                )}
                                {selectedUser && viewMode === 'platform' && (
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors">
                                        User: {selectedUser.userName}
                                    </Badge>
                                )}
                                {filters.highlightedBooksLimit !== 5 && (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors">
                                        Top {filters.highlightedBooksLimit === 9999 ? 'Max' : filters.highlightedBooksLimit} highlighted
                                    </Badge>
                                )}
                                {filters.topBooksLimit !== 10 && (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-blue-100 transition-colors">
                                        Top {filters.topBooksLimit === 9999 ? 'Max' : filters.topBooksLimit} by time
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    )}
                </Collapsible>
            </Card>
        </div>
    );
}