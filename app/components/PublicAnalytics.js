'use client';

import { Analytics } from '@vercel/analytics/next';
import { filterPublicPageview } from './public-analytics-filter.mjs';

export default function PublicAnalytics() {
  return <Analytics beforeSend={(event) => filterPublicPageview(event, {
    doNotTrack: navigator.doNotTrack,
    globalPrivacyControl: navigator.globalPrivacyControl,
  })} />;
}
