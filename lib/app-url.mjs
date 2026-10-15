export function appUrl(env = process.env) {
  const previewHost = env.VERCEL_BRANCH_URL || env.VERCEL_URL;
  if (env.VERCEL_ENV === 'preview' && previewHost) {
    return new URL(`https://${previewHost}`).origin;
  }
  return new URL(env.APP_URL || env.NEXT_PUBLIC_APP_URL || 'https://www.swissbuisness.com').origin;
}
