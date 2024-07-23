import zeitsemester from '../../../data/studienstruktur/zeitsemesterAllAndDefault.json'
import termineInModulen15100Und15200Und15800 from '../../../data/termin/termineInModulen15100Und15200Und15800.json'
import studiengaengeJSON from '../../../data/studienstruktur/studiengaenge.json'
import module from '../../../data/studienstruktur/module.json'
import submoduleInModul15100 from '../../../data/studienstruktur/submodul/submoduleInModul15100.json'
import submoduleInModul15200 from '../../../data/studienstruktur/submodul/submoduleInModul15200.json'
import submoduleInModul15800 from '../../../data/studienstruktur/submodul/submoduleInModul15800.json'
import veranstaltungenInModul15100 from '../../../data/studienstruktur/veranstaltung/veranstaltungenInModul15100.json'
import veranstaltungenInModul15200 from '../../../data/studienstruktur/veranstaltung/veranstaltungenInModul15200.json'
import veranstaltungenInModul15800 from '../../../data/studienstruktur/veranstaltung/veranstaltungenInModul15800.json'
import noEintragungshindernisse from '../../../data/lehrendenEintragung/noEintragungshindernisse.json'
import sampleEintragungshindernisse from '../../../data/lehrendenEintragung/sampleEintragungshindernisse.json'

export default {
    zeitsemester,
    noEintragungshindernisse,
    sampleEintragungshindernisse,
    termineInModulen15100Und15200Und15800,
    studienStrukturInModulen15100Und15200Und15800: {
        studiengaenge: studiengaengeJSON,
        module: module,
        submodule: [...submoduleInModul15100, ...submoduleInModul15200, ...submoduleInModul15800],
        veranstaltungen: [
            ...veranstaltungenInModul15100,
            ...veranstaltungenInModul15200,
            ...veranstaltungenInModul15800,
        ],
    },
}
