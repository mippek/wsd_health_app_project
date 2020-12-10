import { executeQuery } from "../database/database.js";
import { validate, required, isDate, isNumber, isInt, numberBetween } from "../deps.js";

/*const validationRules = {
    date: [required, isDate],
    mood: [required, isInt, numberBetween(1,5)],
    sleep_duration: [required, isNumber, numberBetween(0, 24)],
    sleep_quality: [required, isInt, numberBetween(1,5)],
    exercise_time: [required, isNumber, numberBetween(0, 24)],
    study_time: [required, isNumber, numberBetween(0, 24)],
    eating_quality: [required, isInt, numberBetween(1,5)],
};*/

const morningValidationRules = {
    date: [required, isDate],
    mood: [required, isInt, numberBetween(1,5)],
    sleep_duration: [required, isNumber, numberBetween(0, 24)],
    sleep_quality: [required, isInt, numberBetween(1,5)],
};

const eveningValidationRules = {
    date: [required, isDate],
    mood: [required, isInt, numberBetween(1,5)],
    exercise_time: [required, isNumber, numberBetween(0, 24)],
    study_time: [required, isNumber, numberBetween(0, 24)],
    eating_quality: [required, isInt, numberBetween(1,5)],
};

const validateData = async(data, isMorning) => {
    if (isMorning) {
        return await validate(data, morningValidationRules);
    } else {
        return await validate(data, eveningValidationRules);
    }
}

/*const validateData = async(data) => {
    return await validate(data, validationRules);
}*/

const returnNumberIfNumber = (value) => {
    if (!value) {
        return undefined;
    }
    const possibleNumber = Number(value);
    if (Number.isNaN(possibleNumber)) {
        return value;
    }
    return possibleNumber;
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
        data.mood = returnNumberIfNumber(params.get('mood'));
        if (isMorning) {
            data.sleep_duration = returnNumberIfNumber(params.get('sleep_duration'));
            data.sleep_quality = returnNumberIfNumber(params.get('sleep_quality'));
        } else {
            data.exercise_time = returnNumberIfNumber(params.get('exercise_time'));
            data.study_time = returnNumberIfNumber(params.get('study_time'));
            data.eating_quality = returnNumberIfNumber(params.get('eating_quality'));
        }
    }

    return data;
}

const deleteOldReport = async(date, userId, isMorning) => {
    let oldReport;
    if (isMorning) {
        oldReport = (await executeQuery("SELECT * FROM health_reports WHERE date = $1 AND morning_report = $2 AND user_id = $3", date, true, userId)).rowsOfObjects();
        
    } else {
        oldReport = (await executeQuery("SELECT * FROM health_reports WHERE date = $1 AND evening_report = $2 AND user_id = $3", date, true, userId)).rowsOfObjects();
    }
    if (oldReport.length > 0) {
        await executeQuery("DELETE FROM health_reports WHERE id = $1", oldReport[0].id);
    }
}

const setData = async(data, userId, isMorning) => {
    await deleteOldReport(data.date, userId, isMorning);

    const dbData = {
        date: data.date,
        mood: data.mood,
        sleep_duration: data.sleep_duration,
        sleep_quality: data.sleep_quality,
        exercise_time: data.exercise_time,
        study_time: data.study_time,
        eating_quality: data.eating_quality,
        morning_report: true,
        evening_report: false,
        user_id: userId
    }

    if (isMorning) {
        dbData.exercise_time = null;
        dbData.study_time = null;
        dbData.eating_quality = null;

    } else {
        dbData.morningReport = false;
        dbData.eveningReport = true;
        dbData.sleep_duration = null;
        dbData.sleep_quality = null;
    }
        
    await executeQuery("INSERT INTO health_reports (date, mood, sleep_duration, sleep_quality, exercise_time, study_time, eating_quality, morning_report, evening_report, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
        dbData.date, dbData.mood, dbData.sleep_duration, dbData.sleep_quality, dbData.exercise_time, dbData.study_time, dbData.eating_quality, dbData.morning_report, dbData.evening_report, dbData.user_id
    );
}

const getTodaysReportsFromDb = async(date, userId, isMorning) => {
    return (await executeQuery("SELECT * FROM health_reports WHERE date = $1 AND user_id = $2 AND morning_report = $3", date, userId, isMorning)).rowCount;
}

export { validateData, returnNumberIfNumber, getData, setData, getTodaysReportsFromDb };