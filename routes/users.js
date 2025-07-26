const express = require('express')
const {users} = require('./data/users.json')

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: Get all the list of users in the system
 * Access Public
 * Parameters: None
 */

router.get('/', (req, res)=>{
    res.status(200).json({
        success: true,
        data: users
    })
})
/**
 * Route: /users/:id
 * Method: GET
 * Description: Get user by their ID
 * Access Public
 * Parameters: id
 */
router.get('/:id', (req,res)=>{

    const {id} = req.params;
    const user= users.find((each)=> each.id === id)

    if(!user){
        return res.status(404).json({
            success: false,
            message: `User not found for ID: ${id}`
        })
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

/**
 * Route: /users/
 * Method: POST
 * Description: Create/Register a new user
 * Access Public
 * Parameters: none
 */

router.post('',(req, res)=>{
//     "id": "1",
// "name": "John",
// "surname": "Doe",
// "email": "user@email.com",
// "issuedBook": "1",
// "issuedDate": "04/01/2022",
// "returnDate": "05/01/2022",
// "subscriptionType": "Premium",
// "subscriptionDate": "04/01/2022"

    const {id, name, surname, email, subscriptionType, subscriptionDate} = req.body;

    if(!id || !name || !surname || !email || !subscriptionType || !subscriptionDate){
        return res.status(400).json({
            success: false,
            message: "Please provide the required Fields"
        })
    }

    const user = users.find((each)=>each.id === id)
    if(user){
        res.status(409).json({
            success: false,
            message: `User already exist id: ${id}`
        })
    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionDate,
        subscriptionType
    })
    res.status(201).json({
        success: true,
        message: "User Created Successfully"
    })
})

/**
 * Route: /users/:id
 * Method: PUt
 * Description: Updating a user by their ID
 * Access Public
 * Parameters: ID
 */
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    // Check if the user exist
    const user = users.find((each)=>each.id === id)
    if(!user){
        res.status(404).json({
            success: false,
            message: `User does not exist with ID: ${id}`
        })
    }
//  with Spread operator
    const updatedUser = users.map((each)=>{
        if(each.id==id){
            return {
                ...each,
                ...data,
            } 
        }
        return each
    })
    res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User Updated successfully"
    })
})
/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting a user by their ID
 * Access Public
 * Parameters: ID
 */

router.delete('/:id', (req,res)=>{
    const {id} = req.params;

    // check if the user exists
    const user = users.find((each)=>each.id===id)
    if(!user){
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${id}`
        })
    }

    // If user exists, filter it out from the users array
    const updatedUsers = users.filter((each)=>each.id!==id)

    // 2nd method
    // const index = users.indexOf(user);
    // users.splice(index,1)

    res.status(200).json({
        success: true,
        data: updatedUsers,
        message: "User deleted successfully"
    })
})

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all the subscription-details by id
 * Access: Public
 * Parameter: none
 */
router.get('/subscription-details/:id', (req,res)=>{
    const {id} = req.params
    const user = users.find((each)=>each.id===id)
    if(!user){
        return res.status(404).json({
            success: false,
            message: `User not found for id: ${id}`
        })
    }
    const getDateInDays = (data = '')=>{
        let date;
        if(data){
            date = new Date(data);
        } else{
            date = new Date();
        }
        let days = Math.floor(data / (100*60*60*24));
        return days;
    }
    const subscriptionType = (data) =>{
        if(user.subscriptionType === "Basic"){
            date = date+90
        } else if(user.subscriptionType === "Standard"){
            date = date + 180
        } else if(user.subscriptionType === "Premium"){
            date = date + 365
        }
        return date;
    }

    //  Subscription Expiration Calculation
    // Jan 1, 1970 UTC

    let returnDate = getDateInDays(user.returnDate)
    let currentDate = getDateInDays()
    let subscriptionDate = getDateInDays(user.subscriptionDate)
    let subscriptionExpiration = subscriptionType(subscriptionDate)

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        subscriptionDaysLeft: subscriptionExpiration - currentDate,
        daysLeftForExpiration: returnDate - currentDate,
        returnDate: returnDate < currentDate ? "Book is overdue" : returnDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0
    }
    res.status(200).json({
        success: true,
        data: data
    })
})
module.exports = router;
