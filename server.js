const express = require('express');
const cors = require('cors');
const db = require('./data/dbConfig.js');

const actions = require('./data/helpers/actionModel.js')
const projects = require('./data/helpers/projectModel.js')


const port = 5555;
const server = express();
server.use(express.json());
server.use(cors({ origin: 'http://localhost:3000' }));

//MIDDLEWARE
const errorStatus = (status, message, res) => {
    res.status(status).json({ errorMessage: message });
    return;
}
//

server.get('/', (req, res) => {
    res.send("Hello from express! Welcome to our Sprint Challenge: Projects and Actions!!");
})

//PROJECTS

server.get('/api/projects', (req, res) => {
    projects
        .get()
        .then(project => {
            // console.log(project)
            if(project.length === 0){
                errorStatus(404, 'Projects not found', res)
            } else {
                res.json(project);
            }
        })
        .catch(err => {
            errorStatus(500, 'There was an error retrieving projects', res)
        })
})

server.get('/api/projects/:id', (req, res) => {
    projects
        .get(req.params.id)
        .then(project => {
            console.log(project)
            if(project === 0){
                errorStatus(404, 'The project with the specified id does not exist on our database', res);
            } else{
                res.json(project)
            }
        })
        .catch(err => {
            errorStatus(500, 'There was an error retrieving projects', res)
        })

})

server.post('/api/projects', (req, res) => {
    const { name, description } = req.body;
    if(!name || !description){
        errorStatus(400, 'Please provide a name and description for your project', res);
        return;
    }
    projects
        .insert({ name, description })
        .then(project => {
            res.json(project);
        })
        .catch(err => {
            errorStatus(500, 'There was an error posting your project', res)
        })
})

server.put("/api/projects/:id", (req, res) => {
    const { name, description } = req.body;
    if(!name || !description){
        errorStatus(400, 'Please provide a name and description for your project', res);
        return;
    }
    projects
        .update(req.params.id, { name, description })
        .then(project => {
            if(project === 0){
                errorStatus(404, 'The project with the specified id does not exist on our database', res);
            } else{
                res.json(project)
            }
        })
        .catch(err => {
            errorStatus(500, 'The project information could not be modified', res)
        })
})

//ACTIONS

server.listen(port, () => console.log(`Server is running on port ${port}`));