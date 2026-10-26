import { createApp } from "./app.js";
import { prisma } from "./shared/prisma.js";

const port = Number(process.env.PORT ?? 3000);
const server = createApp().listen(port, "0.0.0.0");

server.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

let shuttingDown = false;

function shutdown() {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  // Force exit if connections refuse to close
  setTimeout(() => process.exit(1), 10_000).unref();

  server.close(() => {
    prisma.$disconnect().then(
      () => process.exit(0),
      (error) => {
        console.error(error);
        process.exit(1);
      },
    );
  });
  server.closeIdleConnections();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);