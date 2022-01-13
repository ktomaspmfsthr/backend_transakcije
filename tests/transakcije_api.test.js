const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const pomocni = require('./test_pomocni')

const api = supertest(app)

const Transakcija = require('..models/transakcija')
beforeEach( async () => {
    await Transakcija.deleteMany({})
    let objektTransakcija = new Transakcija(pomocni.pocetneTransakcije[0])
    await objektTransakcija.save()
    objektTransakcija = new Transakcija(pomocni.pocetneTransakcije[1])
    await objektTransakcija.save()
    objektTransakcija = new Transakcija(pomocni.pocetneTransakcije[2])
    await objektTransakcija.save()
})

test('transakcije se vraćaju kao JSON', async () => {
    await api
        .get('/api/transakcije')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('imamo dvije transakcije', async() => {
    const odgovor = await api.get('/api/transakcije')

    expect(odgovor.body).toHaveLength(pomocni.pocetneTransakcije.length)
})

test('Prva transakcija je vezana za mobitel', async () => {
    const odgovor = await api.get('/api/transakcije')

    expect(odgovor.body[0].opis).toBe('mobitel')
})

test('dodavanje ispravne transakcije', async () => {
    const novaTransakcija = {
        vrsta: 'rashod',
        datum: new Date(),
        opis: 'hrana',
        iznos: 120
    }
    await api
    .post('/api/transakcije')
    .send(novaTransakcija)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const transakcijeNaKraju = await pomocni.transakcijeIzBaze()
    expect(transakcijeNaKraju).toHaveLength(pomocni.pocetneTransakcije.length + 1)
    const opis = transakcijeNaKraju.map(t => t.opis)
    expect(opis).toContain('hrana')
})

test('dodavanje transakcije bez iznosa', async () => {
    const novaTransakcija = {
        opis: 'jastuk'
    }
    await api
    .post('/api/transakcije')
    .send(novaTransakcija)
    .expect(400)

    const transakcijeNaKraju = await pomocni.transakcijeIzBaze()
    expect(transakcijeNaKraju).toHaveLength(pomocni.pocetneTransakcije.length)
})

afterAll(() => {
    mongoose.connection.close()
})