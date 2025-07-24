const express = require('express')
const app = express();
const books = require('./data/books.js')
const users = require('./data/users.js')

const port = 4000;

app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).json({
        message: "Home_page :-"
    })
})
// app.all('*', (req, res)=>{
//     res.status(500).json({
//         message: "under construction"
//     })
// })

app.listen(port, ()=>{
    console.log(`Server is up and running on http://localhost:${port}`);
    
})