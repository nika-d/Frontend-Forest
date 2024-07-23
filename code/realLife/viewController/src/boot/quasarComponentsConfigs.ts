import { QBtn, QBtnDropdown, QCard, QInput, QSelect, QTooltip } from 'quasar'
import { setQuasarComponentDefaultPropValues } from './setQuasarComponentDefaultPropValues'

export default () => {
    setQuasarComponentDefaultPropValues(QBtn, {
        unelevated: true,
        color: 'primary',
        noCaps: true,
    })
    setQuasarComponentDefaultPropValues(QBtnDropdown, {
        unelevated: true,
        color: 'primary',
        noCaps: true,
        outline: true,
        autoClose: true,
    })
    setQuasarComponentDefaultPropValues(QCard, {
        flat: true,
    })
    setQuasarComponentDefaultPropValues(QSelect, {
        outlined: true,
        dense: true,
    })
    setQuasarComponentDefaultPropValues(QInput, {
        outlined: true,
        dense: true,
        bgColor: 'white',
    })
    setQuasarComponentDefaultPropValues(QTooltip, {
        delay: 500,
    })
}
