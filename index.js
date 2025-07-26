const express = require('express')
const app = express();



const usersRouter = require('./routes/users')
const booksRouter = require('./routes/books')
const port = 4000;

app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).json({
        message: "Home_page :-"
    })
})
app.use('/users', usersRouter)
app.use('/books', booksRouter)




// app.all('*', (req, res)=>{
//     res.status(500).json({
//         message: "under construction"
//     })
// })

app.listen(port, ()=>{
    console.log(`Server is up and running on http://localhost:${port}`);
    
})