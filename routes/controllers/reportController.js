import { validateData, getData, setData, getTodaysReportsFromDb } from "../../services/reportService.js";

/*import { executeQuery } from "../../database/database.js";
const hello = async({response}) => {
    const date = new Date(); 
    const res = (await executeQuery("SELECT * FROM health_reports;")).rowsOfObjects();
    
    
    response.body = res;
};*/

const hello = async({render}) => {
    const date = new Date();
    console.log(date);
    const morningReports = await getTodaysReportsFromDb(date, true);
    const eveningReports = await getTodaysReportsFromDb(date, false);

    let morning = false;
    let evening = false;

    if (morningReports.length > 0) {
        morning = true;
    }
    if (eveningReports.length > 0) {
        evening = true;
    }

    render('index.ejs', {morning: morning, evening: evening});
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