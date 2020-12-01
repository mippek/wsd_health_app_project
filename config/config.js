let config = {};

if (Deno.env.get('TEST_ENVIRONMENT')) {
  config.database = {};
} else {
  config.database = {
    hostname: "hattie.db.elephantsql.com",
    database: "fftfqykn",
    user: "fftfqykn",
    password: "YIEkS9DLGh1bHN4tzIppmX1TV-LprIQi",
    port: 5432
  };
}

export { config }; 