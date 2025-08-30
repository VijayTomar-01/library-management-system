const express = require('express')
const app = express();

const usersRouter = require('./routes/users')
const booksRouter = require('./routes/books')

const PORT = 4000;

app.use(express.json());

app.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        message: "Home Page"
    })
})

app.use('/users', usersRouter);
app.use('/books', booksRouter)

app.listen(PORT, ()=>{
    console.log(`App is up and running on http://localhost:${PORT}`);
})