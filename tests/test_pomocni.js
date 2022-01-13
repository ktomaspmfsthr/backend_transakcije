const Transakcija = require('../models/transakcija')

const pocetneTransakcije = [
    {
        vrsta: 'prihod',
        datum: new Date(),
        opis: 'instrukcije iz P1',
        iznos: 60
    },
    {
        vrsta: 'rashod',
        datum: new Date(),
        opis: 'romobil',
        iznos: 3300
    },
    {
        vrsta: 'rashod',
        datum: new Date(),
        opis: 'kopiranje skripte',
        iznos: 80
    }
]

const transakcijeIzBaze = async () => {
    const transakcije = await Transakcija.find({})
    return transakcije.map(p => p.toJSON())
}

module.exports = {
    pocetneTransakcije, transakcijeIzBaze
}