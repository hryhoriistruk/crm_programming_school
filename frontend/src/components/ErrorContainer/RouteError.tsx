import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons';

import style from './Error.module.css';

const RouteError = () => {
    return (
        <div className={style.RouteContainer}>
            <h1>404</h1>
            <h1>Page Not Found</h1>
            <div className={style.RouteIcon}>
                <FontAwesomeIcon icon={faFaceSadTear} />
            </div>
        </div>
    );
};

export { RouteError };
