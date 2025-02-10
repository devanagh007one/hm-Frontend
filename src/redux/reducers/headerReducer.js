import { SET_MAIN_TITLES, SET_PROFILE_TITLES, SET_ACTIVE_INDEX, SET_ACTIVE_COMPONENT } from '../actions';
import { IconLayoutGridFilled, IconUser } from '@tabler/icons-react'; // Import icons
import { getDecryptedRolesWithHeaders } from '../actions'; // Import the utility function

const rolesWithHeaders = getDecryptedRolesWithHeaders();

// Extracting correct `mainTitles` and `profileTitles`
const mainTitles = rolesWithHeaders.length
  ? rolesWithHeaders.flatMap(roleData => roleData.mainTitles)
  : [{ title: 'Usersmanagement', component: 'Usersmanagement', icon: <IconLayoutGridFilled stroke={2} className="icon-side" /> }];

const profileTitles = rolesWithHeaders.length
  ? rolesWithHeaders.flatMap(roleData => roleData.profileTitles)
  : [{ title: 'Profile Settings', component: 'ProfileSettings', icon: <IconUser stroke={2} className="icon-side" /> }];

const initialState = {
  mainTitles,
  profileTitles, // Now profileTitles is defined
  activeIndex: 0,
  activeComponent: 'Dashboard',
};

const headerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MAIN_TITLES:
      return {
        ...state,
        mainTitles: action.payload.length ? action.payload : state.mainTitles,
      };
    case SET_PROFILE_TITLES:
      return {
        ...state,
        profileTitles: action.payload,
      };
    case SET_ACTIVE_INDEX:
      return {
        ...state,
        activeIndex: action.payload,
      };
    case SET_ACTIVE_COMPONENT:
      return {
        ...state,
        activeComponent: action.payload,
      };
    default:
      return state;
  }
};

export default headerReducer;
