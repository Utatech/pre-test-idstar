import { BankType, ModalType } from "../action-types/index"

interface ModalAction {
    type: ModalType.MODAL,
    payload: boolean
}

// export type Action = DepositAction | WithdrawAction | BankruptAction | ModalAction;
export type Action = ModalAction;