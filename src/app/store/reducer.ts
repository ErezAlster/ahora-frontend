import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { labelsReducer } from './labels/reducers'
import { statusesReducer } from './statuses/reducers';
import { currentUserReducer } from './currentuser/reducers';
import { currentOrganizationsReducer } from './organizations/reducers';
import { docTypesReducer } from './docTypes/reducers';




const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    labels: labelsReducer,
    statuses: statusesReducer,
    currentUser: currentUserReducer,
    organizations: currentOrganizationsReducer,
    docTypes: docTypesReducer
})
export default createRootReducer;