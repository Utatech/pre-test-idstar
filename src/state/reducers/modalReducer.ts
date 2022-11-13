import { ModalType } from "../action-types/index"
import { Action } from "../actions"

const initialState = false;

const reducer = (state: boolean = initialState, action: Action): boolean => {
    switch (action.type){
        case ModalType.MODAL:
            return state ? false : true;
        default:
            return state
    }
}

export default reducer