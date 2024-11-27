import { FC, useEffect, useState } from 'react';

import style from '../OrdersContainer/Order.module.css';

interface IProps {
    page: number;
    totalPages: number;
    selectPage: (page: number) => void;
    maxCenterPages: number;
    maxEdgePages: number;
}

const Pagination: FC<IProps> = ({
    totalPages,
    page,
    selectPage,
    maxCenterPages,
    maxEdgePages,
}) => {
    const [allPages, setAllPages] = useState<number[]>([]);

    useEffect(() => {
        const pages = [];
        let start: number;
        let end: number;

        if (totalPages <= maxCenterPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= Math.floor(maxEdgePages / 2)) {
                start = 1;
                end = maxEdgePages;
            } else if (page >= totalPages - Math.floor(maxEdgePages / 2)) {
                start = totalPages - maxEdgePages + 1;
                end = totalPages;
            } else {
                start = page - Math.floor(maxCenterPages / 2);
                end = page + Math.floor(maxCenterPages / 2);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        setAllPages(pages);
    }, [page, totalPages, maxEdgePages, maxCenterPages]);

    return (
        <nav className={style.NavLinks}>
            <ul className="pagination">
                {page !== 1 && (
                    <li className={`page-item`}>
                        <span
                            className={`page-link ${style.ListItem}`}
                            onClick={() => selectPage(page - 1)}
                        >
                            &laquo;
                        </span>
                    </li>
                )}
                {allPages[0] > 1 && (
                    <>
                        <li className={`page-item`}>
                            <span
                                className={`page-link ${style.ListItem}`}
                                onClick={() => selectPage(1)}
                            >
                                1
                            </span>
                        </li>
                        {allPages[0] > 2 && (
                            <li className="page-item">
                                <span className={`page-link ${style.ListItem}`}>
                                    ...
                                </span>
                            </li>
                        )}
                    </>
                )}

                {allPages.map((item) => (
                    <li className={`page-item`} key={item}>
                        <span
                            className={`page-link ${style.ListItem} 
                            ${page === item && style.ListActive}`}
                            onClick={() => selectPage(item)}
                        >
                            {item}
                        </span>
                    </li>
                ))}
                {allPages[allPages.length - 1] < totalPages && (
                    <>
                        {allPages[allPages.length - 1] < totalPages - 1 && (
                            <li className="page-item">
                                <span className={`page-link ${style.ListItem}`}>
                                    ...
                                </span>
                            </li>
                        )}
                        <li className="page-item">
                            <span
                                className={`page-link ${style.ListItem}`}
                                onClick={() => selectPage(totalPages)}
                            >
                                {totalPages}
                            </span>
                        </li>
                    </>
                )}

                {page < totalPages && (
                    <li className="page-item">
                        <span
                            className={`page-link ${style.ListItem}`}
                            onClick={() => selectPage(page + 1)}
                        >
                            &raquo;
                        </span>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export { Pagination };
