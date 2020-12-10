let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: "hattie.db.elephantsql.com" /*Deno.env.get('PGHOST')*/,
    database: "fftfqykn" /*Deno.env.get('PGDATABASE')*/,
    user: "fftfqykn" /*Deno.env.get('PGUSER')*/,
    password: "YIEkS9DLGh1bHN4tzIppmX1TV-LprIQi" /*Deno.env.get('PGPASSWORD')*/,
    port: 5432 /*Deno.env.get('PGPORT')*/
  };
}

export { config }; 