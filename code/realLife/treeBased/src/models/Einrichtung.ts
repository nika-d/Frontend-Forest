import { initObjectFromDTO } from './common/initObjectFromDTO'
import { type domainId } from './common/domainId'
import { z } from 'zod'

export class EinrichtungDTO {
    readonly id!: domainId
    readonly bezeichnungLang!: string
}

export class Einrichtung extends EinrichtungDTO {
    readonly bezeichnungGekuerzt: string

    readonly kuerzel: string
    readonly titel: string
    readonly campus: string

    constructor(dto: Partial<EinrichtungDTO>) {
        super()
        initObjectFromDTO(dto, this, schema)
        this.bezeichnungGekuerzt = verkuerzeTypischeWoerter(this.bezeichnungLang)

        const teile = this.bezeichnungGekuerzt.split(' - ')

        if (teile.length == 1) {
            this.kuerzel = ''
            this.titel = teile[0]
            this.campus = ''
        } else {
            this.kuerzel = teile[0]

            this.titel = teile[1]
            for (let i = 2; i < teile.length - 1; i++) this.titel += ' - ' + teile[i]

            this.campus = teile.length > 2 ? (teile.at(-1) as string) : ''
        }

        this.bezeichnungGekuerzt = this.bezeichnungGekuerzt.replaceAll(' - ', ' ')
    }
}

const schema = z.object({
    id: z.number().min(1),
    bezeichnungLang: z.string().min(10),
})

function verkuerzeTypischeWoerter(name: string) {
    let verkuerzt

    verkuerzt = String(name)

    verkuerzt = verkuerzt.replace('Medizinische Klinik für', 'Med. K. f.')

    verkuerzt = verkuerzt.replace('Medizinische Klinik mit Schwerpunkt', 'Med. K. m. S.')

    verkuerzt = verkuerzt.replace('Institut für', 'I. f.')

    verkuerzt = verkuerzt.replace('Klinik für', 'K. f.')

    verkuerzt = verkuerzt.replace('Arbeitsbereich', 'Arb.')

    verkuerzt = verkuerzt.replace('Abteilung für', 'Abt. f.')

    verkuerzt = verkuerzt.replace('mit Schwerpunkt', 'm. S.')
    verkuerzt = verkuerzt.replace('für', 'f.')
    verkuerzt = verkuerzt.replace('mit', 'm.')
    verkuerzt = verkuerzt.replace('Klinik', 'K.')
    verkuerzt = verkuerzt.replace('dem', 'd.')
    verkuerzt = verkuerzt.replace('Bereich', 'B.')

    verkuerzt = verkuerzt.replace('Medizinische', 'Med.')
    verkuerzt = verkuerzt.replace('Medizinischen', 'Med.')
    verkuerzt = verkuerzt.replace('Medizinisches', 'Med.')
    verkuerzt = verkuerzt.replace('medizinische', 'med.')
    verkuerzt = verkuerzt.replace('medizinischen', 'med.')
    verkuerzt = verkuerzt.replace('medizinisches', 'med.')

    return verkuerzt
}
