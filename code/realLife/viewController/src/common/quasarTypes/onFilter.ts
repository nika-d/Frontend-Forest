import { QSelect } from 'quasar'

/** Emitted when user wants to filter a value */
export type onFilter = (inputValue: string, doneFn: onFilterDoneFn, abortFn: () => void) => void
/** executed when pressing enter without selecting */
export type onFilterDoneFn = (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
