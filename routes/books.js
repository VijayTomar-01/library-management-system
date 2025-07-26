const express = require('express');
const {books} = require('./data/books.json')
const {users} = require('./data/users.json')
const router = express.Router();

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
 * Route: /books/:id
 * Method: GET
 * Description: Get the books in the system by id
 * Access Public
 * Parameters: ID
 */
router.get('/:id', (req,res)=>{
    const {id} = req.params;
    const book = books.find((each)=>each.id===id)
    if(!book){
        res.status(404).json({
            success: false,
            message: `Book nod Found For ID: ${id}`
        })
    }  
    res.status(200).json({
        success: true,
        data: book
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
    const {id, name, author, genre, price, publisher} = req.body;

    if(!id || !name, !author, !genre, !price, !publisher){
        res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }
    const book = books.find((each)=>each.id===id)
    if(book){
        return res.status(409).json({
            success: false,
            message: `book already exist with the id: ${id}`
        })
    }

    books.push({id, name, author, genre, price, publisher})

    res.status(200).json({
        success: true,
        message: "The book is added successfully",
        data: {id, name, genre, author, price, publisher}
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
    const {id} = req.params
    const {data} = req.body

 

    const book = books.find((each)=>each.id===id)
    if(!book){
        return res.status(404).json({
            success: false,
            message: `Book does not found with id: ${id}`
        })
    }

    // Object.assign(book,data)
        const updatedBook = books.map((each)=>{
            if(each.id===id){
                return {
                    ...each, 
                    ...data,
                }
            } return each
        })
        
 

    res.status(200).json({
        success: true,
        data: updatedBook,
        message: `Book updated successfully`,
        
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
    const {id} = req.params
    const {data} = req.body

    const book = books.find((each)=>each.id===id)
    if(!book){
        return res.status(404).json({
            success: false,
            message: `Book not found with id: ${id}`
        })
    }
    const updatedBook = books.filter((each)=>each.id!==id)

    res.status(200).json({
        success: true,
        data: updatedBook,
        message: `Book deleted successfully with id: ${id}`
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
    const usersWithIssuedBooks = users.filter((each)=>{
        if(each.issuedBook){
            return each
        }
    })
    const issuedBooks = [];
    usersWithIssuedBooks.forEach((each)=>{
        const book = books.find((book)=>book.id === each.issuedBook)

        book.issuedBy = each.name;
        book.issueDate = each.issueDate;
        book.returnDate = each.returnDate;
        issuedBooks.push(book) 
    })
    if(!issuedBooks){
        return res.status(404).json({
            success: false,
            message: "No book issued yet"
        })
    }
    res.status(200).json({
        success: true,
        data: issuedBooks
    })
})
module.exports = router;