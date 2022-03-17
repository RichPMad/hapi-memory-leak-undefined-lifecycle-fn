const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    debug: { log: ['*'] },
    port: 3000,
    host: '127.0.0.1',
  });

  server.ext('onRequest', (request, h) => {
    request.app.sillyLargeObject = new ArrayBuffer(1024 * 1024);
    return h.continue;
  });

  /* START Magic memory leak code */
  const functionThatIsUndefined = undefined;
  server.ext('onRequest', functionThatIsUndefined);
  /* END  Magic memory leak code */

  server.route({
    method: 'GET',
    path: '/',
    handler(request, h) {
      return h.response('ok');
    },
  });

  server.log('info', { msg: `Server running on ${server.info.uri}` });
  server.start();
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
