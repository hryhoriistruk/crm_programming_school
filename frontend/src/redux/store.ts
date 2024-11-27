import { configureStore } from '@reduxjs/toolkit';

import { managerReducer, authReducer, orderReducer } from './slices';

const store = configureStore({
    reducer: {
        auth: authReducer,
        order: orderReducer,
        manager: managerReducer,
    },
});

export { store };
