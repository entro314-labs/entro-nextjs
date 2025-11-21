'use client';

import { forwardRef, useCallback } from 'react';
import type { OutboundLinkProps } from '../../types';
import { useEntrolytics } from '../hooks/useEntrolytics';

/**
 * Component for tracking outbound link clicks.
 *
 * @example
 * ```tsx
 * <OutboundLink href="https://stripe.com" data={{ context: 'pricing' }}>
 *   Payment Provider
 * </OutboundLink>
 *
 * <OutboundLink href="https://github.com/entro314-labs" target="_blank">
 *   View on GitHub
 * </OutboundLink>
 * ```
 */
export const OutboundLink = forwardRef<HTMLAnchorElement, OutboundLinkProps>(
  ({ href, data, children, onClick, ...props }, ref) => {
    const { trackOutboundLink, isReady, config } = useEntrolytics();

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isReady) {
          const isExternal =
            props.target === '_blank' ||
            e.ctrlKey ||
            e.shiftKey ||
            e.metaKey ||
            (e.button && e.button === 1);

          // For internal navigation, prevent default and track first
          if (!isExternal) {
            e.preventDefault();
            await trackOutboundLink(href, data);
            // Navigate after tracking
            if (props.target === '_top' && window.top) {
              window.top.location.href = href;
            } else {
              window.location.href = href;
            }
          } else {
            // For external/new tab, track without blocking
            trackOutboundLink(href, data);
          }
        }

        onClick?.(e);
      },
      [isReady, trackOutboundLink, href, data, onClick, props.target]
    );

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        data-entrolytics-event={config.outboundLinkEvent}
        data-entrolytics-event-url={href}
        {...props}
      >
        {children}
      </a>
    );
  }
);

OutboundLink.displayName = 'OutboundLink';
