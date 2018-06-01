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

server.listen(port, () => console.log(`Server is running on port ${port}`));