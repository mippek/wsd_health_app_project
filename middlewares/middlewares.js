import { send } from "../deps.js";

const errorMiddleware = async(context, next) => {
    try {
      await next();
    } catch (e) {
      console.log(e);
    }
}

const serveStaticFiles = async (context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  } else {
    await next();
  }
}

const authMiddleware = async({request, response, session}, next) => {
  if (request.url.pathname !== '/' && !request.url.pathname.startsWith('/api') && !request.url.pathname.startsWith('/auth') && !(await session.get('authenticated'))) {
    response.redirect('/auth/login');
  } else {
    await next();
  }
}

export { errorMiddleware, serveStaticFiles, authMiddleware };