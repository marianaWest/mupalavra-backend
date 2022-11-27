const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2020
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'Mupalavra'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('termos').find().toArray()  
    .then(data => {
        console.log(data)
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))
})


app.post('/addTermo', (request, response) => { 
    db.collection('termos').insertOne({termo: request.body.inputTermo, 
    descricaoTermo: request.body.descricao, 
    likes: 0}) 
    .then(result => {
        console.log('Termo adicionado')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

// app.put('/addOneLike', (request, response) => {
//     db.collection('termos').updateOne({termo: request.body.termoS, descricaoTermo: request.body.descricaoTermoS, likes: request.body.likesS},{
//         $set: {
//             likes:request.body.likesS + 1
//           }
//     },{
//         sort: {_id: -1},
//         upsert: true
//     })
//     .then(result => {
//         console.log('Added One Like')
//         response.json('Like Added')
//     })
//     .catch(error => console.error(error))

// })

app.delete('/deletarTermo', (request, response) => { 
    db.collection('termos').deleteOne({termo: request.body.termoS}) 
    .then(result => {
        console.log('Termo apagado') 
        response.json('Termo apagado') 
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

