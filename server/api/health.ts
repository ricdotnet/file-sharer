import { Logger } from '@ricdotnet/logger/dist';

export default defineEventHandler(async () => {
  return Response.json({ status: 'ok' }, { status: 200 });
});
