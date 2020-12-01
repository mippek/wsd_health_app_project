import { Application, Router } from "./deps.js";
import { executeQuery } from "./database/database.js";

const app = new Application();
const router = new Router();

const hello = async({response}) => {
  const res = (await executeQuery("SELECT * FROM names;")).rowsOfObjects();
  response.body = res;
};

router.get('/', hello);

app.use(router.routes());

app.listen({ port: 7777 });