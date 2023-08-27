import fs from "fs";
import { unstable_dev } from "wrangler";

const worker = await unstable_dev("./worker.ts", {});

console.log(worker);

console.log(await worker.fetch("/"));
