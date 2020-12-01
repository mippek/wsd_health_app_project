import { executeQuery } from "../../database/database.js";

/*const hello = async({response}) => {
    const res = (await executeQuery("SELECT * FROM names;")).rowsOfObjects();
    response.body = res;
};*/

const hello = ({render}) => {
    render('index.ejs');
};

const morning = ({render}) => {
    render('morning.ejs');
}

export { hello, morning };