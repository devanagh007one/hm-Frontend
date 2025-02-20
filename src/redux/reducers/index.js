import { combineReducers } from 'redux';
import headerReducer from './headerReducer';
import themeReducer from './themeReducer';
import authReducer from './authReducer';
import notificationReducer from './notificationReducer';
import logoutReducer from './logoutReducer';
import forgetReducer from './ForgetReducer';
import alluserReducer from './alluserReducer'; 
import alllicensingReducer from './allLicensingReducer'; 
import allcontentReducer from './allContentReducer';
import eventReducer from './alleventReducer';
import notifications from './allNotificationsReducer';

const rootReducer = combineReducers({
    header: headerReducer,
    theme: themeReducer,
    auth: authReducer,
    notification: notificationReducer,
    session: logoutReducer,
    forgetPassword: forgetReducer,
    user: alluserReducer,
    licensing: alllicensingReducer,
    hrlicensing: alllicensingReducer,
    content: allcontentReducer,
    events: eventReducer,
    dashnotifications: notifications,

});

export default rootReducer;