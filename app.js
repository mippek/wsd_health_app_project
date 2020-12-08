import { Application } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from "./middlewares/middlewares.js";
import { viewEngine, engineFactory, adapterFactory } from "./deps.js";
import { Session } from "./deps.js";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

app.use(middleware.errorMiddleware);
app.use(middleware.serveStaticFiles);
app.use(middleware.authMiddleware);

app.use(router.routes());

app.listen({ port: 7777 });