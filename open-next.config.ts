import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/**
 * OpenNext for Cloudflare. Every page is prerendered at build time and never revalidated, so
 * the read-only static-assets cache serves them: no R2 bucket or KV namespace to create.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
