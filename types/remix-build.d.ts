import type { ServerBuild } from '@remix-run/cloudflare';

declare module '../build/server' {
  const build: ServerBuild;
  export default build;
}
