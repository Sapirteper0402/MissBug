import { authService } from '../auth/auth.service.js'
import { bugService } from './bug.service.js'

// CRUDL

//List
export async function getBugs(req, res) {
    try {
        // const loggedinUser = authService.validateToken(req.cookies.loginToken)

        const filterBy = {
            title: req.query.title || '',
            severity: +req.query.severity || '',
            labels: req.query.labels || '',
            pageIdx: req.query.pageIdx,
            creator: req.query.creator || ''
        }
        // console.log(filterBy.labels);
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Couldn't get bugs...`) 
    }
}

//GetById
export async function getBug(req, res) {
    var { bugId } = req.params
    const visitedBugs = req.cookies.visitedBugs || []
    console.log("User visited at the following bugs: ", visitedBugs)

    try {
        if (visitedBugs.length >= 3 && !visitedBugs.includes(bugId)) {
            return res.status(401).send('Wait for a bit')
        }
        if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)

        const bug = await bugService.getById(bugId)
        
        res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })
        res.send(bug) 
    } catch (err) {
        res.status(400).send(`Couldn't get bugs`)
    }
}

//Create
export async function addBug(req, res) {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add bug')

    // const { _id, title, severity, description, createdAt } = req.query
    const { title, severity, description } = req.body
    const bugToSave = 
    { 
        title, 
        severity: +severity, 
        description, 
        createdAt: Date.now(), 
        labels: ["label1", "label2", "label3"] 
    }

    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        console.log(err)
        res.status(400).send(`Couldn't save bug...`)
    }

}

//Update
export async function updateBug(req, res) {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { _id, title, severity, description, createdAt, labels } = req.body
    const bugToSave = { _id, title, severity, description, createdAt, labels }

    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
        res.send(savedBug)
    } catch (err) {
        console.log(err)
        res.status(400).send(`Couldn't save bug...`)
    }
}

//Delete
export async function removeBug(req, res) {
    // const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Not authenticated')

    var { bugId } = req.params

    try {
        await bugService.remove(bugId, req.loggedinUser)
        res.send(`bug ${bugId} removed`)
    } catch (err) {
        res.status(400).send(`Couldn't remove bug...`)   
    }
}

