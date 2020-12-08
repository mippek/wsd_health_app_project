import { validateData, getData, setData, getUserByEmail, isCorrectPassword, setSession, cleanSession, returnUserIfAuthenticated } from "../../services/userService.js";

const showRegistration = async({render, session}) => {
    const data = await getData();
    data.user = await returnUserIfAuthenticated(session);
    render('users/register.ejs', data);
}

const register = async({request, render, response, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const data = await getData(request, true);
    const [passes, errors] = await validateData(data);

    if (!passes) {
        data.errors = errors;
        data.user = user;
        render('users/register.ejs', data);
        return;
    }

    if (data.password !== data.verification) {
        data.errors = { password: { verification: "the entered passwords did not match" } };
        data.user = user;
        render('users/register.ejs', data);
        return;
    }

    const existingUsers = await getUserByEmail(data.email);
    if (existingUsers.length > 0) {
        data.errors = { email: { isUnique: "the email is already reserved" } };
        data.user = user;
        render('users/register.ejs', data);
        return;
    }
    
    await setData(data.email, data.password);
    response.redirect('/auth/login');
}

const showLogin = async({render, session}) => {
    const data = await getData();
    data.user = await returnUserIfAuthenticated(session)
    render('users/login.ejs', data);
}

const authenticate = async({request, render, response, session}) => {
    const user = await returnUserIfAuthenticated(session);
    const data = await getData(request, false);

    const res = await getUserByEmail(data.email);
    if (res.length === 0) {
        data.errors = { credentials: { shouldMatch: "invalid email or password" } };
        data.user = user;
        render('users/login.ejs', data);
        return;
    }

    const userObj = res[0];
    const hash = userObj.password;
    if (!(await isCorrectPassword(data.password, hash))) {
        data.errors = { credentials: { shouldMatch: "invalid email or password" } };
        data.user = user;
        render('users/login.ejs', data);
        return;
    }

    await setSession(session, userObj);
    response.redirect('/');
}

const logout = async({response, session}) => {
    await cleanSession(session);
    response.redirect('/');
}

export { showRegistration, register, showLogin, authenticate, logout };