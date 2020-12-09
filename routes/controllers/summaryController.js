import { returnUserIfAuthenticated } from "../../services/userService.js";
import { validateData, getSummaryData, setSummaryData, getDailyAvg, getWeeklyAvg, getMonthlyAvg } from "../../services/summaryService.js";

const showIndexPageSummary = async({render, session}) => {
    const today = new Date();
    const avgMoodToday = await getDailyAvg(today.toISOString().split('T')[0]);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const avgMoodYesterday = await getDailyAvg(yesterday.toISOString().split('T')[0]);
    render('index.ejs', {
        avg_mood_today: avgMoodToday[0].avg_mood, 
        avg_mood_yesterday: avgMoodYesterday[0].avg_mood, 
        user: await returnUserIfAuthenticated(session)
    });
}

const showSummary = async({render, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const userId = user.id;
    const data = await getSummaryData();
    console.log(data);
    const addedData = {
        weekly_average: (await getWeeklyAvg(data.week_no, userId))[0],
        monthly_average: (await getMonthlyAvg(data.month_no, userId))[0],
        user: user
    }
    setSummaryData(addedData);

    console.log(await getSummaryData());
    
    render('summary.ejs', await getSummaryData());
}

const submitSummaryWeek = async({request, render, response, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const data = await getSummaryData(request, true);
    const [passes, errors] = await validateData(data, true);
    
    if (!passes) {
        data.week_errors = errors;
        data.week_no = '--';
        data.week_year = '----';
        data.weekly_average = null;
        data.user = user;
        render('summary.ejs', data);
    } else {
        await setSummaryData(data, true);
        response.redirect('/behavior/summary');
    }
}

const submitSummaryMonth = async({request, render, response, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const data = await getSummaryData(request, false);
    const [passes, errors] = await validateData(data, false);
    
    if (!passes) {
        data.month_errors = errors;
        data.month_no = '--';
        data.month_year = '----';
        data.monthly_average = null;
        data.user = user;
        render('summary.ejs', data);
    } else {
        await setSummaryData(data, false);
        response.redirect('/behavior/summary');
    }
}

export { showIndexPageSummary, showSummary, submitSummaryWeek, submitSummaryMonth };