import { Logger } from '@ricdotnet/logger/dist/index.js';

const matcher = new RegExp(
  '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
);

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const headers = getRequestHeaders(event);

  if (!url.pathname.match(matcher)) {
    return;
  }

  Logger.get().info(`${url} - ${JSON.stringify(headers)}`);
});
