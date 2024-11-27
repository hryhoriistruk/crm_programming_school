const baseURL = 'http://localhost:4000';

const auth = '/auth';
const login = `${auth}/login`;
const refresh = `${auth}/refresh`;
const logout = `${auth}/logout`;
const register = `${auth}/register`;
const recovery = `${auth}/recovery`;
const activate = `${auth}/activate`;
const activateManager = `${auth}/activate-manager`;
const recoveryPassword = `${auth}/recovery-password`;
const ban = `${auth}/ban`;
const unban = `${auth}/unban`;

const managers = '/managers';

const orders = '/orders';
const groups = '/groups';
const statuses = '/statuses';
const courses = '/courses';
const course_formats = '/course-formats';
const course_types = '/course-types';
const download = '/download';
const comment = '/addComment';

const urls = {
    auth: {
        login,
        refresh,
        logout,
        register,
        activateManager,
        recoveryPassword,
        ban: (id: number) => `${ban}/${id}`,
        unban: (id: number) => `${unban}/${id}`,
        activate: (id: number) => `${activate}/${id}`,
        recovery: (id: number) => `${recovery}/${id}`,
    },
    orders: {
        base: orders,
        groups: `${orders}${groups}`,
        statuses: `${orders}${statuses}`,
        courses: `${orders}${courses}`,
        course_formats: `${orders}${course_formats}`,
        course_types: `${orders}${course_types}`,
        download: `${orders}${download}`,
        addComment: (id: number) => `${orders}/${id}${comment}`,
        update: (id: number) => `${orders}/${id}`,
    },
    managers: {
        base: managers,
        me: `${managers}/me`,
    },
};

export { baseURL, urls };
