import { executeQuery } from "../database/database.js";
import { bcrypt } from "../deps.js";
import { validate, required, isEmail, minLength } from "../deps.js";

const loginValidationRules = {
    email: [required, isEmail],
    password: [required, minLength(4)],
};

const registerValidationRules = {
    email: [required, isEmail],
    password: [required, minLength(4)],
    verification: [required, minLength(4)]
}

const validateData = async(data, isRegistration) => {
    if (isRegistration) {
        return await validate(data, registerValidationRules);
    } else {
        return await validate(data, loginValidationRules);
    }
}

const getData = async(request, isRegistration) => {
    const data = {
        email: null,
        password: null,
        verification: null,
        errors: null
    }

    if (request) {
        const body = request.body();
        const params = await body.value;
        data.email = params.get('email');
        data.password = params.get('password');
        if (isRegistration) {
            data.verification = params.get('verification');

        }
    }

    return data;
}

const setData = async(email, password) => {
    const hash = await bcrypt.hash(password);
    await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2)", email, hash);
}

const getUserByEmail = async(email) => {
    const res = (await executeQuery("SELECT * FROM users WHERE email = $1", email)).rowsOfObjects();
    return res;
}

const isCorrectPassword = async(password, hash) => {
    return await bcrypt.compare(password, hash);
}

const setSession = async(session, userObj) => {
    await session.set('authenticated', true);
    await session.set('user', {
        id: userObj.id,
        email: userObj.email
    });
}

const cleanSession = async(session) => {
    await session.set('authenticated', false);
    await session.set('user', null);
}

const returnUserIfAuthenticated = async(session) => {
    const authenticated = await session.get('authenticated');
    if (authenticated) {
        const user = await session.get('user');
        return user;
    } else {
        return null;
    }
}

export { validateData, getData, setData, getUserByEmail, isCorrectPassword, setSession, cleanSession, returnUserIfAuthenticated };