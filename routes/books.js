const express = require('express');
const { books } = require('./data/books.json');
const { users } =require('./data/users.json')
const router = express();

/**
 * Route: /books
 * Method: GET
 * Description: Get all the books in the system
 * Access Public
 * Parameters: none
 */
router.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        data: books
    })
})
/**
 * Route: /books
 * Method:POST
 * Description: Add a new book into the system
 * Access Public
 * Parameters: ID
 */
router.post('/', (req,res)=>{
    const {id, name, author, genre, publisher, price} = req.body
    if(!id || !name || !author || !genre || !publisher || !price){
        res.status(400).json({
            success: false,
            message: `Please provide all the required fields`
        })
    }
    const book = books.find(each=> each.id === id)
    if(book){
       return res.status(409).json({
        success: false,
        message: `Book already exist with id ${id}`
       })
    }
    books.push({id, name, author, genre, publisher, price})
    res.status(201).json({
        success: true,
        message: `Book added successfully with id ${id}`,
        data: {id, name, author, publisher, genre, price}
    })
})
/**
 * Route: /books/:id
 * Method: GET
 * Description: Get the books in the system by id
 * Access Public
 * Parameters: ID
 */
router.get('/:id', (req,res)=>{
    const {id} = req.params;
    const book = books.find(each=> each.id === id)
    if(!book){
        res.status(404).json({
            success: false,
            message: `Book with id ${id} doesn't exist`
        })
    }
    res.status(200).json({
        success: true,
        data: book
    })
})
/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update a book by its ID
 * Access Public
 * Parameters: ID
 */
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    const {data} = req.body;
    const book = books.find(each=> each.id === id)
    if(!book){
        res.status(404).json({
            success: false,
            message: `Book doesn't exist with id ${id}`
        })
    }
    const updatedBook = books.map((each)=>{
        if(each.id === id){
            return{
                ...each,
                ...data
            }
        }
        return each
    })
    res.status(201).json({
        success: true,
        message: `Book updated successfully with id ${id}`,
        data: updatedBook
    })
})
/**
 * Route: /books/:id
 * Method: DELETE
 * Description: Delete a book by its ID
 * Access Public
 * Parameters: ID
 */
router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    const book = books.find(each=> each.id === id)
    if(!book){
        res.status(404).json({
            success: false,
            message: `Book doesn't exist with id ${id}`
        })
    }
    const updatedBook = books.filter(each=> each.id !== id)
    res.status(200).json({
        success: true,
        data: updatedBook,
        message: `Book deleted successfully with id ${id}`
    })
})
/**
 * Route: /books/issued/for-users
 * Method: GET
 * Description: all issued books
 * Access Public
 * Parameters: none
 */
router.get('/issued/for-users', (req,res)=>{
    const usersWithIssuedBooks = users.filter(user => user.issuedBook)
    const issuedBooks = [];
    usersWithIssuedBooks.forEach(user => {
        const book = books.find(book=> book.id === user.issuedBook);
        if(book){
            issuedBooks.push({
                ...book,
                issuedBy: user.name,
                issuedDate: user.issuedDate,
                returnDate: user.returnDate
            })
        }
    })
 
    if(issuedBooks.length === 0){
        res.status(404).json({
            success: false,
            message: `Book not issued yet`
        })
    }
    res.status(200).json({
        success: true,
        data: issuedBooks
    })
})
module.exports = router