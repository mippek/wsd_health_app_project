let config = {};
let port = 7777;

if (Deno.env.get('DATABASE_URL')) {
  config.database = Deno.env.get('DATABASE_URL');
  if (Deno.args.length > 0) {  
    const lastArgument = Deno.args[Deno.args.length - 1];  
    port = Number(lastArgument);
  }
} else {
  config.database = {};
}

export { config, port }; 