import { Login } from '../components';
import style from './AuthPage.module.css';

const LoginPage = () => {
    return (
        <div className={style.Container}>
            <Login />
        </div>
    );
};

export { LoginPage };
