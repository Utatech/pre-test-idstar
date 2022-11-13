import { Dispatch } from "redux"
import { ModalType } from "../action-types"
import { Action } from "../actions/index"

export const setOpen = (state: boolean) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ModalType.MODAL,
            payload: state
        })
    }
}