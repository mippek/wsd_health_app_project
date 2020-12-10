import { send } from "../deps.js";
import { returnUserIfAuthenticated } from "../services/userService.js";

const errorMiddleware = async(context, next) => {
    try {
      await next();
    } catch (e) {
      console.log(e);
    }
}

const loggerMiddleware = async({request, session}, next) => {
  const user = await returnUserIfAuthenticated(session);
  const time = new Date();
  const formatted_time = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
  if (!user) {
    console.log(`${request.method} ${request.url.pathname} ${formatted_time} user_id: anonymous`);
  } else {
    console.log(`${request.method} ${request.url.pathname} ${formatted_time} user_id: ${user.id}`);
  }
  await next();
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

export { errorMiddleware, loggerMiddleware, serveStaticFiles, authMiddleware };