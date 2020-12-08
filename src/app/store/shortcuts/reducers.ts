import { ShortcutsState, ShortcutActionTypes, ADD_SHORTCUT, DELETE_SHORTCUT, RECEIVE_SHORTCUTS, UPDATE_SHORTCUT, UPDATE_SHURTCUT_SEARCH_CRITERIAS, UPDATE_UNREAD_DOCS_SHORTCUT, REPORT_DOC_READ, SHORTCUT_DOCS_RECEIVED, SHORTCUT_DOCS_ADD } from './types'
import { OrganizationShortcut } from 'app/services/OrganizationShortcut';
import { SET_CURRENT_ORGANIZATION } from '../organizations/types';
import StoreOrganizationShortcut from './StoreOrganizationShortcut';
import { DELETE_DOC } from '../docs/types';
import { ADD_COMMENT, SET_COMMENT } from '../comments/types';

const initialState: ShortcutsState = {
    shortcuts: [],
    map: new Map<string, StoreOrganizationShortcut>([
        ["inbox", { searchCriteria: { mention: ["me"] }, disableNotification: false, unreadDocs: new Set() }],
        ["docs", { searchCriteria: { status: ["open"] }, disableNotification: true, unreadDocs: new Set() }]
    ]),
    loading: false
}

export function shortcutsReducer(state = initialState, action: ShortcutActionTypes): ShortcutsState {
    switch (action.type) {
        case UPDATE_SHURTCUT_SEARCH_CRITERIAS:
            let shortcutStore = state.map.get(action.payload.shortcutId);
            if (shortcutStore) {
                shortcutStore = { ...shortcutStore, searchCriteria: action.payload.searchCriterias }
                state.map.set(action.payload.shortcutId, shortcutStore);
            }
            return { ...state };
        case SET_CURRENT_ORGANIZATION:
            return { ...initialState }
        case ADD_SHORTCUT:
            state.map.set(action.payload.id!.toString(), { shortcut: action.payload, searchCriteria: action.payload.searchCriteria, disableNotification: false, unreadDocs: new Set() });
            return { ...state, shortcuts: [...state.shortcuts, action.payload], map: state.map }
        case RECEIVE_SHORTCUTS:
            const shortcuts: OrganizationShortcut[] = [];
            action.data.forEach(async (shortcut) => {
                shortcuts.push(shortcut);
                state.map.set(shortcut.id!.toString(), { shortcut: shortcut, searchCriteria: shortcut.searchCriteria, disableNotification: false, unreadDocs: new Set() });
            });
            return { ...state, shortcuts, map: state.map, loading: false }
        case DELETE_SHORTCUT:
            state.map.delete(action.meta.id.toString());
            return {
                ...state,
                map: state.map,
                shortcuts: state.shortcuts ? state.shortcuts.filter(
                    shortcut => shortcut.id !== action.meta.id
                ) : []

            }
        case UPDATE_SHORTCUT:
            state.map.set(action.payload.id!.toString(), { shortcut: action.payload, searchCriteria: action.payload.searchCriteria, disableNotification: false, unreadDocs: new Set() });
            return {
                ...state,
                shortcuts: state.shortcuts ? state.shortcuts.map((shortcut) => shortcut.id === action.payload.id ? action.payload : shortcut) : [action.payload]
            }

        case UPDATE_UNREAD_DOCS_SHORTCUT:
            let shortcutFromState = state.map.get(action.payload.shortcutId);
            if (shortcutFromState) {
                const shortcutState = { ...shortcutFromState };
                action.payload.unreadDocs.forEach((docId) => {
                    shortcutState.unreadDocs?.delete(docId);
                    shortcutState.unreadDocs?.add(docId);

                    shortcutState.docs?.delete(docId);
                    shortcutState.docs?.add(docId);

                    shortcutState.unreadDocs = new Set(shortcutState.unreadDocs);
                    shortcutState.docs = new Set(shortcutState.docs);
                });
                state.map.set(action.payload.shortcutId, shortcutFromState);
            }
            return { ...state, map: new Map(state.map) };
        case SHORTCUT_DOCS_RECEIVED:
            const shortcut = state.map.get(action.payload.shortcutId);
            if (shortcut) {
                shortcut.docs = new Set();
                if (action.payload.docs) {
                    action.payload.docs.forEach((docId) => shortcut.docs?.add(docId));
                }
                state.map.set(action.payload.shortcutId, { ...shortcut, page: action.payload.page, totalDocs: action.payload.totalDocs });
            }
            return { ...state, map: new Map(state.map) };

        case DELETE_DOC:
            state.map.forEach((shortcut) => {
                shortcut.docs?.delete(action.payload);
                shortcut.unreadDocs?.delete(action.payload);
            })
            return { ...state, map: new Map(state.map) };
        case SHORTCUT_DOCS_ADD:
            const addedshortcut = state.map.get(action.payload.shortcutId);
            addedshortcut?.docs?.add(action.payload.docId);
            return { ...state, map: new Map(state.map) };
        case SET_COMMENT:
            let docId: number = action.payload.docId;
            state.map.forEach((shortcut) => {
                if (shortcut.unreadDocs?.has(docId) || shortcut.docs?.has(docId)) {
                    shortcut.unreadDocs?.delete(docId);
                    shortcut.unreadDocs?.add(docId);

                    shortcut.docs?.delete(docId);
                    shortcut.docs?.add(docId);

                    shortcut.unreadDocs = new Set(shortcut.unreadDocs);
                    shortcut.docs = new Set(shortcut.docs);

                }
            });
            return { ...state, map: new Map(state.map) };

        case REPORT_DOC_READ:
            docId = action.payload;
            state.map.forEach((shortcut) => {
                if (shortcut.unreadDocs?.has(docId) || shortcut.docs?.has(docId)) {
                    shortcut.unreadDocs?.delete(docId);
                    shortcut.unreadDocs = new Set(shortcut.unreadDocs);

                }
            });
            return { ...state, map: new Map(state.map) };
        case ADD_COMMENT:
            docId = action.payload.docId;
            state.map.forEach((shortcut) => {
                if (shortcut.unreadDocs?.has(docId) || shortcut.docs?.has(docId)) {
                    shortcut.unreadDocs?.delete(docId);

                    shortcut.docs?.delete(docId);
                    shortcut.docs?.add(docId);
                    shortcut.docs = new Set(shortcut.docs);
                    shortcut.unreadDocs = new Set(shortcut.unreadDocs);
                }
            });
            return { ...state, map: new Map(state.map) };

        default:
            return state
    }
}