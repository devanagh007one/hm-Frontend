import { CLEAR_SESSION } from '../actions/logoutActions';

const initialState = {
    userData: JSON.parse(sessionStorage.getItem('userData')) || null,
};

const logoutReducer = (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_SESSION:
            return {
                ...state,
                userData: null, 
            };
        default:
            return state;
    }
};

export default logoutReducer;
