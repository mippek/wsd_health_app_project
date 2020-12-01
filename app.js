import { Application, Router } from "./deps.js";

const app = new Application();
const router = new Router();

const hello = ({response}) => {
  response.body = 'Hello world!';
};

router.get('/', hello);

app.use(router.routes());

app.listen({ port: 7777 });