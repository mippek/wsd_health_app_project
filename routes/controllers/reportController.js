import { validateData, getData, setData } from "../../services/reportService.js";

/*import { executeQuery } from "../../database/database.js";
const hello = async({response}) => {
    const res = (await executeQuery("SELECT * FROM health_reports;")).rowsOfObjects();
    response.body = res;
};*/

const hello = ({render}) => {
    render('index.ejs');
};

const showMorningReport = async({render}) => {
    render('reports/morning.ejs', await getData());
}

const submitMorningReport = async({request, render, response}) => {
    const data = await getData(request, true);
    const [passes, errors] = await validateData(data);
    
    if (!passes) {
        data.errors = errors;
        render('reports/morning.ejs', data)
    } else {
        await setData(data, true);
        response.redirect('/behavior/reporting');
    }
    
}

const showEveningReport = async({render}) => {
    render('reports/evening.ejs', await getData());
}

const submitEveningReport = async({request, render, response}) => {
    const data = await getData(request, false);
    const [passes, errors] = await validateData(data);
    
    if (!passes) {
        data.errors = errors;
        render('reports/evening.ejs', data)
    } else {
        await setData(data, false);
        response.redirect('/behavior/reporting');
    }
    
}

export { hello, showMorningReport, submitMorningReport, showEveningReport, submitEveningReport };