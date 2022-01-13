const express = require('express')
const cors = require('cors')
const Transakcija = require('./models/transakcija')
const app = express()
app.use(cors())
app.use(express.json())

let transakcije = [
    {
    id: 1,
    vrsta: 'rashod',
    datum: '11/1/2021',
    opis: 'putovanje',
    iznos: 250,
    },
    {
    id: 2,
    vrsta: 'prihod',
    datum: '11/5/2021',
    opis: 'posao',
    iznos: 500,
    },
]

app.get('/', (req, res) =>{
 res.send('<h1>Pozdrav od Express servera</h1>')
})

app.get('/api/transakcije', (req, res) =>
{
 Transakcija.find({}).then( rezultat =>
{
    res.json(rezultat)
  })
})

app.get('/api/transakcije/:id', (req, res, next) =>{
    Transakcija.findById(req.params.id)
    .then(transakcija => {
      if (transakcija) {
        res.json(transakcija)
      } else {
        res.status(404).end()
      }

    })
    .catch(error => next(error))
  })

app.delete('/api/transakcije/:id', (req, res) => {
    Transakcija.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})
  
app.post('/api/transakcije', (req, res, next) => {

    const podatak = req.body

    const transakcija = new Transakcija({
      vrsta: podatak.vrsta,
      datum: new Date(),
      opis: podatak.opis,
      iznos: podatak.iznos
    })
    
    transakcija.save()
    .then(spremljenaTransakcija => {
      res.json(spremljenaTransakcija)
    })
    .catch(err => next(err))
  })

  app.put('/api/transakcije/:id', (req, res) => {
    const podatak = req.body;
    const id = req.params.id;

    const transakcija = {
      vrsta: podatak.vrsta,
      datum: new Date(),
      opis: podatak.opis,
      iznos: podatak.iznos
    }

    Transakcija.findbyIdAndUpdate(id, transakcija, {new: true})
    .then( novaTransakcija => {
      res.json(novaTransakcija)
    })
    .catch(err => next(err))
  })

  const generirajId = () => {
    const maxId = transakcije.length > 0
      ? Math.max(...transakcije.map(t => t.id))
      : 0
    return maxId + 1
  }

  const errorHandler = (err, req, res, next) => {
    console.log(err.message);

    if (err.name === 'CastError') {
      return res.status(400).send({error: 'krivi format ID-a'})
    } else if (err.name === 'ValidationError'){
        return res.status(400).send({error: err.message})
    }
    next(err)
  }

  function zadnjiErrorHandler (err, req, res, next) {
    res.status(500)
    res.send('error', { error: err})
  }

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
 console.log(`Posluzitelj je pokrenut na portu ${PORT}`);
})


