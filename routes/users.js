const express = require('express');
const { users } = require('./data/users.json')
const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: Get all the list of users in the system
 * Access Public
 * Parameters: None
 */
router.get('/', (req,res)=>{
    res.status(200).json({
        success: true,
        message: users
    })
})

/**
 * Route: /users
 * Method: POST
 * Description: Create/Register a new user
 * Access Public
 * Parameters: None
 */
router.post('/', (req,res)=>{
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
        res.status(404).json({
            success: false,
            message: "Please provide the required fields"
        })
    }
    const user = users.find(each=> each.id === id);
    if(user){
        res.status(409).json({
            success: false,
            message: `User already exist with id: ${id}`
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
        message: `User successfully registered with id: ${id}`
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
    const user = users.find(each=> each.id === id)

    if(!user){
        res.status(404).json({
            success: false,
            message: `User with id ${id} doesn't exist`
        })
    }
    res.status(200).json({
        success: true,
        data: user
    })
})

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating a user by their ID
 * Access Public
 * Parameters: ID
 */
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find(each=> each.id === id)
    if(!user){
        res.status(404).json({
            success: false,
            message: `User with id ${id} doesn't exist`
        })
    }

    const updatedUser = users.map((each)=>{
        if(each.id === id){
            return{
                ...each,
                ...data
            }
        }
        return each;
    })
    res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User Updated Successfully"
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
    const {id} = req.params
    const user = users.find(each=> each.id === id)

    if(!user){
        res.status(404).json({
            success: false,
            message: `User with id ${id} doesn't exist`
        })
    }
    const updatedUser = users.filter(each=> each.id !== id)

    res.status(200).json({
        success: true,
        data: updatedUser,
        message: `User with id ${id} was deleted successfully`
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
    const {id} = req.params;
    const user = users.find(each=> each.id === id);

    if(!user){
        res.status(404).json({
            success: false,
            message: `user with id ${id} doesn't exist`
        })
    }

    const getDateInDays = (data = '')=>{
        let date;
        if(data){
            date = new Date(data);
        } else{
            date = new Date()
        }
        let days = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
        return days;

    }
        const subscriptionType = (startDateInDays)=>{
            expirationDate = startDateInDays;
            if(user.subscriptionType === 'Basic'){
                expirationDate += 90;
            } else if(user.subscriptionType === 'Standard'){
                expirationDate += 180;
            } else if(user.subscriptionType === 'Premium'){
                expirationDate += 365;
            }
            return expirationDate;
        }

        let returnDate = getDateInDays(user.returnDate);
        let currentDate = getDateInDays();
        let subscriptionDate = getDateInDays(user.subscriptionDate);
        let subscriptionExpirationDate = subscriptionType(subscriptionDate)

        const data = {
            ...user,
            subscriptionExpired: subscriptionExpirationDate < currentDate,
            subscriptionDaysLeft: subscriptionExpirationDate - currentDate,
            daysLeftForExpiration: returnDate - currentDate,
            returnDate: currentDate > returnDate ? 'Book is Overdue' : returnDate,
            fine: returnDate < currentDate
                  ? (subscriptionExpirationDate <= currentDate ? 200 : 100)
                  : 0
        }
        res.status(200).json({
            success: true,
            data: data
        })
})

module.exports = router;