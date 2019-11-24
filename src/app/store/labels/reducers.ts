import { LabelsState, LabelActionTypes, ADD_LABEL, DELETE_LABEL } from './types'

const initialState: LabelsState = {
    labels: [],
    loading: false
}

export function labelReducer(state = initialState, action: LabelActionTypes): LabelsState {
    switch (action.type) {
        case ADD_LABEL:
            return { ...state, labels: [...state.labels, action.payload] }
        case DELETE_LABEL:
            return {
                ...state,
                labels: state.labels.filter(
                    label => label.id !== action.meta.id
                )
            }
        default:
            return state
    }
}