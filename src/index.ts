import { build } from "./app";

const PORT = process.env.PORT || 3000;

const server = async () => {
  const app = await build({ logger: true });
  await app.listen({ port: +PORT }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`server listening on ${address}`);
  });
};

server();
