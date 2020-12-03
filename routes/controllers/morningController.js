import { executeQuery } from "../../database/database.js";
import { validate, required, isDate, isNumber, isInt, numberBetween } from "../../deps.js";

const validationRules = {
    date: [required, isDate],
    sleep_duration: [required, isNumber, numberBetween(0, 24)],
    sleep_quality: [required, isInt, numberBetween(1,5)],
    mood: [required, isInt, numberBetween(1,5)]
};

/*const hello = async({response}) => {
    const res = (await executeQuery("SELECT * FROM health_reports;")).rowsOfObjects();
    response.body = res;
};*/

const hello = ({render}) => {
    render('index.ejs');
};

const showMorningReport = async({render}) => {
    render('reports/morning.ejs', await getData());
}

const getData = async(request) => {
    const data = {
        date: null,
        sleep_duration: 0,
        sleep_quality: 3,
        mood: 3, 
        errors: null
    }

    if (request) {
        const body = request.body();
        const params = await body.value;
        data.date = params.get('date');
        data.sleep_duration = Number(params.get('sleep_duration'));
        data.sleep_quality = Number(params.get('sleep_quality'));
        data.mood = Number(params.get('mood'));
    }

    return data;
}

const submitMorningReport = async({request, render, response}) => {
    const data = await getData(request);
    const [passes, errors] = await validate(data, validationRules);
    
    if (!passes) {
        data.errors = errors;
        render('reports/morning.ejs', data)
    } else {
        await executeQuery("INSERT INTO health_reports (date, mood, sleep_duration, sleep_quality, morning_report, user_id) VALUES ($1, $2, $3, $4, $5, $6)", 
            data.date, data.mood, data.sleep_duration, data.sleep_quality, true, 1
        );
        response.redirect('/behavior/reporting');
    }
    
}

export { hello, showMorningReport, submitMorningReport };