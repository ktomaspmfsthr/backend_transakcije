const mongoose = require('mongoose')

const url = process.env.ATLASS_URL

const transakcijaSchema = new mongoose.Schema({
        vrsta: {
            type: String,
            required: true
        },
        datum: {
            type: Date,
            required: true
        },
        opis: {
            type: String,
            required: true
        },
        iznos: {
            type: Number,
            required: true
        }
})

transakcijaSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})

mongoose.connect(url)
    .then(result => {
        console.log("Spojeni smo na bazu");
    })
    .catch(error => {
        console.log("Greška pri spajanju", error.message);
    })

module.exports = mongoose.model('Transakcija', transakcijaSchema, 'transakcije')