export default defineEventHandler(async () => {
  return Response.json({ status: 'ok' }, { status: 200 });
});
