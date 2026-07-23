import { log } from "node:console";
import app from "./app";
import { prisma } from "./lib/prisma";
import "dotenv/config";
import config from "./config";

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
