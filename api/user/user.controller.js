import { userService } from './user.service.js'
import { authService } from '../auth/auth.service.js'

// CRUDL

//List
export async function getUsers(req, res) {
    try {
        const users = await userService.query()
        res.send(users)
    } catch (err) {
        res.status(400).send(`Couldn't get users...`) 
    }
}

//GetById
export async function getUser(req, res) {
    var { userId } = req.params
    
    try {
        const user = await userService.getById(userId)
        res.send(user) 
    } catch (err) {
        res.status(400).send(`Couldn't get user`)
    }
}

//Create
export async function addUser(req, res) {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)

    // const { title, severity, description, createdAt } = req.query
    const { fullname, username, password, score } = req.body
    const userToSave = 
    { 
        fullname, 
        username, 
        password, 
        score: score || 200 
    }

    try {
        const savedUser = await userService.save(userToSave, req.loggedinUser)
        res.send(savedUser)
    } catch (err) {
        console.log(err)
        res.status(400).send(`Couldn't save user...`)
    }

}

//Update
export async function updateUser(req, res) {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update user')

        // const { _id, title, severity, description, createdAt } = req.query
    const { _id, fullname, username, password, score } = req.body
    const userToSave = { _id, fullname, username, password, score }

    try {
        const savedUser = await userService.save(userToSave, req.loggedinUser)
        res.send(savedUser)
    } catch (err) {
        console.log(err)
        res.status(400).send(`Couldn't save user...`)
    }
}

//Delete
export async function removeUser(req, res) {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Not authenticated')

    var { userId } = req.params

    try {
        await userService.remove(userId, req.loggedinUser)
        res.send(`user ${userId} removed`)
    } catch (err) {
        res.status(400).send(`Couldn't remove user...`)   
    }
}