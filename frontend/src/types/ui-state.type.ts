export interface LoadingState {
  highlightedBooks: boolean;
  lowAvailabilityBooks: boolean;
  topBooks: boolean;
  readingTrends: boolean;
  deviceAnalytics: boolean;
  userProfile: boolean;
}

export interface ComponentState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type ViewMode = 'personal' | 'platform';
