const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.json())

const headers = {
    'Authorization': '563492ad6f917000010000018b69b8abf29b4c2183d0c2d3b418a241'
}

app.get('/photos', (req, res) => {
    axios('https://api.pexels.com/v1/search?query=model', {headers})
    .then(response => {
        res.json(response.data)
        //console.log(response.data)
    })    
})

app.get("/users", (req, res) => {
    axios('http://localhost:5000/users')
    .then(response => {
        res.json(response.data)
        //console.log(response.data)
    })
})

app.put('/update', (req, res) => {
    console.log("Edit id: ", req.body.id)
    fetch('http://localhost:5000/users/' + req.body.id, {
        method: 'PUT',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(req.body)
    })
})

app.delete('/delete', (req, res) => {
    console.log('Delete id: ', req.body.id)
    fetch('http://localhost:5000/users/' + req.body.id, {
        method: 'DELETE',
        headers: { "Content-Type": "application/vnd.api+json"}
    }).then(res => {
        console.log('ID Deleted from JSON: ', res.data.id)
    })
})

app.post('/save', (req, res) => {
    console.log('Record Added: ', req.body)
    fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(req.body)
    })
})

app.listen(3001, () => {console.log('Server is running on PORT: 3001')})