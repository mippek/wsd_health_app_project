import { validateData, getData, setData, getTodaysReportsFromDb } from "../../services/reportService.js";
import { returnUserIfAuthenticated } from "../../services/userService.js";

const showReporting = async({render, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const date = new Date().toISOString().split('T')[0];
    const userId = user.id; 
    
    const morningReports = await getTodaysReportsFromDb(date, userId, true);
    const eveningReports = await getTodaysReportsFromDb(date, userId, false);

    let morning = false;
    let evening = false;

    if (morningReports.length > 0) {
        morning = true;
    }
    if (eveningReports.length > 0) {
        evening = true;
    }

    render('reporting.ejs', {
        morning: morning, 
        evening: evening,
        user: user
    });
};

const showMorningReport = async({render, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const data = await getData();
    data.user = user;
    render('reports/morning.ejs', data);
}

const submitMorningReport = async({request, render, response, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const data = await getData(request, true);
    const userId = user.id; 
    const [passes, errors] = await validateData(data, true);
    
    if (!passes) {
        data.errors = errors;
        const morningData = data;
        morningData.user = user;
        render('reports/morning.ejs', morningData);
    } else {
        await setData(data, userId, true);
        response.redirect('/behavior/reporting');
    }
}

const showEveningReport = async({render, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const data = await getData();
    data.user = user;
    render('reports/evening.ejs', data);
}

const submitEveningReport = async({request, render, response, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const data = await getData(request, false);
    const userId = user.id; 
    const [passes, errors] = await validateData(data, false);
    
    if (!passes) {
        data.errors = errors;
        const eveningData = data;
        eveningData.user = user;
        render('reports/evening.ejs', eveningData);
    } else {
        await setData(data, userId, false);
        response.redirect('/behavior/reporting');
    }
    
}

export { showReporting, showMorningReport, submitMorningReport, showEveningReport, submitEveningReport };