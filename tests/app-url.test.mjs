import test from 'node:test';
import assert from 'node:assert/strict';
import {appUrl} from '../lib/app-url.mjs';

test('preview payment and password links stay on the preview branch', () => {
  assert.equal(appUrl({VERCEL_ENV:'preview',VERCEL_BRANCH_URL:'app-git-verification.example.vercel.app',VERCEL_URL:'app-build.example.vercel.app',NEXT_PUBLIC_APP_URL:'https://www.swissbuisness.com'}), 'https://app-git-verification.example.vercel.app');
});

test('preview links fall back to the deployment URL when no branch alias exists', () => {
  assert.equal(appUrl({VERCEL_ENV:'preview',VERCEL_URL:'app-build.example.vercel.app',NEXT_PUBLIC_APP_URL:'https://www.swissbuisness.com'}), 'https://app-build.example.vercel.app');
});

test('production uses the public origin, independent of Vercel preview metadata', () => {
  assert.equal(appUrl({VERCEL_ENV:'production',VERCEL_BRANCH_URL:'app-git-main.example.vercel.app',NEXT_PUBLIC_APP_URL:'https://www.swissbuisness.com/'}), 'https://www.swissbuisness.com');
  assert.equal(appUrl({}), 'https://www.swissbuisness.com');
});
