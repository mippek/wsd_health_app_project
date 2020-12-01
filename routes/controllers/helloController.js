import { executeQuery } from "../../database/database.js";

const hello = async({response}) => {
    const res = (await executeQuery("SELECT * FROM names;")).rowsOfObjects();
    response.body = res;
};

export { hello };