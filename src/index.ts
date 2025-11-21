// Client-side exports (default)
export {
  EntrolyticsProvider,
  EntrolyticsContext,
  useEntrolytics,
  usePageView,
  useEventTracker,
  TrackEvent,
  OutboundLink,
  Script,
} from './client';

// Type exports
export type {
  EntrolyticsConfig,
  EntrolyticsContextValue,
  EventData,
  EventPayload,
  IdentifyPayload,
  TrackedProperties,
  EnhancedIdentityData,
  TrackEventProps,
  OutboundLinkProps,
  UsePageViewOptions,
  ProxyConfig,
  TrackOptions,
  BeforeSendCallback,
  PayloadType,
} from './types';
