const express = require('express')
const cors = require('cors')
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

app.get('/api/transakcije', (req, res) =>{
 res.json(transakcije)
})

app.get('/api/transakcije/:id', (req, res) =>{
    const id = Number(req.params.id)
    const transakcija = transakcije.find(t => t.id === id)
    
    if (transakcija){
      res.json(transakcija)
    } else {
      res.status(404).end()
    }
  })

app.delete('/api/transakcije/:id', (req, res) => {
    const id = Number(req.params.id)
    transakcije = transakcije.filter(t => t.id !== id)
  
    res.status(204).end()
})
  
app.post('/api/transakcije', (req, res) => {

    const podatak = req.body
    /*if(!podatak.iznos){
      return res.status(400).json({
        error: 'Nedostaje iznos'
      })
    }*/
    
    let transakcija = {
        id: generirajId(),
        vrsta: podatak.vrsta,
        datum: podatak.datum,
        opis: podatak.opis,
        iznos: podatak.iznos,
      
    }
    transakcije = transakcije.concat(transakcija)
    
    res.json(transakcija)
  })

  app.put('/api/poruke/:id', (req, res) => {
    const podatak = req.body;
    const id = Number(req.params.id);

    console.log("Promjena važnosti poruke sa ID", id);

    transakcije.map(t => t.id !== id ? t : podatak);
    res.json(podatak);
  })

  const generirajId = () => {
    const maxId = transakcije.length > 0
      ? Math.max(...transakcije.map(t => t.id))
      : 0
    return maxId + 1
  }


const PORT = 3001
app.listen(PORT, () => {
 console.log(`Posluzitelj je pokrenut na portu ${PORT}`);
})
