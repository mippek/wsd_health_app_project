import { executeQuery } from "../database/database.js";
import { validate, required, isDate, isNumber, isInt, numberBetween } from "../deps.js";

const validationRules = {
    date: [required, isDate],
    mood: [required, isInt, numberBetween(1,5)],
    sleep_duration: [required, isNumber, numberBetween(0, 24)],
    sleep_quality: [required, isInt, numberBetween(1,5)],
    exercise_time: [required, isNumber, numberBetween(0, 24)],
    study_time: [required, isNumber, numberBetween(0, 24)],
    eating_quality: [required, isInt, numberBetween(1,5)],
};

const validateData = async(data) => {
    return await validate(data, validationRules);
}

const getData = async(request, isMorning) => {
    const data = {
        date: null,
        mood: 3,
        sleep_duration: 0,
        sleep_quality: 3,
        exercise_time: 0,
        study_time: 0,
        eating_quality: 3,
        errors: null
    }

    if (request) {
        const body = request.body();
        const params = await body.value;
        data.date = params.get('date');
        data.mood = Number(params.get('mood'));
        if (isMorning) {
            data.sleep_duration = Number(params.get('sleep_duration'));
            data.sleep_quality = Number(params.get('sleep_quality'));
        } else {
            data.exercise_time = Number(params.get('exercise_time'));
            data.study_time = Number(params.get('study_time'));
            data.eating_quality = Number(params.get('eating_quality'));
        }
    }

    return data;
}

const deleteOldReport = async(date, isMorning) => {
    let oldReport;
    if (isMorning) {
        oldReport = (await executeQuery("SELECT * FROM health_reports WHERE date = $1 AND morning_report = $2", date, true)).rowsOfObjects();
        
    } else {
        oldReport = (await executeQuery("SELECT * FROM health_reports WHERE date = $1 AND evening_report = $2", date, true)).rowsOfObjects();
    }
    if (oldReport.length > 0) {
        await executeQuery("DELETE FROM health_reports WHERE id = $1", oldReport[0].id);
    }
}

const setData = async(data, isMorning) => {
    await deleteOldReport(data.date, isMorning);

    let morningReport = true;
    let eveningReport = false;

    const dbData = {
        date: data.date,
        mood: data.mood,
        sleep_duration: data.sleep_duration,
        sleep_quality: data.sleep_quality,
        exercise_time: data.exercise_time,
        study_time: data.study_time,
        eating_quality: data.eating_quality,
    }

    if (isMorning) {
        dbData.exercise_time = null;
        dbData.study_time = null;
        dbData.eating_quality = null;

    } else {
        morningReport = false;
        eveningReport = true;
        dbData.sleep_duration = null;
        dbData.sleep_quality = null;
    }
        
    await executeQuery("INSERT INTO health_reports (date, mood, sleep_duration, sleep_quality, exercise_time, study_time, eating_quality, morning_report, evening_report, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
        dbData.date, dbData.mood, dbData.sleep_duration, dbData.sleep_quality, dbData.exercise_time, dbData.study_time, dbData.eating_quality, morningReport, eveningReport, 1
    );
}

export { validateData, getData, setData };