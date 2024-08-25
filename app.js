const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require("cors")
const databasePath = path.join(__dirname, 'assignment.db')

const app = express()

app.use(express.json())
let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

function authenticateToken(request, response, next) {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Your Not Authorized User To  Make Changes On Assignments')
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send(
          'Your Not Authorized User To  Make Changes On Assignments',
        )
      } else {
        next()
      }
    })
  }
}

app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const selectUserQuery = `SELECT * FROM users WHERE username = '${username}';`
  const databaseUser = await database.get(selectUserQuery)
  if (databaseUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatched = await bcrypt.compare(
      password,
      databaseUser.password,
    )
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      }
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN')
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})
app.get('/assignments', async (request, response) => {
  try {
    const getAllAssignment = `SELECT * FROM student`
    const dbResponse = await database.all(getAllAssignment)
    response.send(dbResponse)
  } catch (error) {
    response.send(error)
  }
})
app.get(
  '/assignments/:studentId',
  authenticateToken,
  async (request, response) => {
    const {studentId} = request.params
    try {
      const getAllAssignment = `SELECT * FROM student WHERE studentId = ${studentId}`
      const dbResponse = await database.all(getAllAssignment)
      response.send(dbResponse)
    } catch (error) {
      response.send(error)
    }
  },
)

app.put(
  '/assignments/:studentId',
  authenticateToken,
  async (request, response) => {
    const {studentId} = request.params
    const {name, totalScore, dueDate, grade} = request.body
    const updateAssignment = `
  UPDATE
    student
  SET
    studentId = ${studentId},
    name = '${name}',
    totalScore = ${totalScore},
   dueDate = '${dueDate}',
    grade = '${grade}'
  WHERE
   studentId = ${studentId};
  `
    await database.run(updateAssignment)
    const getAllAssignment = `SELECT * FROM student WHERE studentId = ${studentId}`
    const dbResponse = await database.all(getAllAssignment)
    response.send(dbResponse)
  },
)

app.delete(
  '/assignments/:studentId',
  authenticateToken,
  async (request, response) => {
    const {studentId} = request.params
    try {
      const deleteAssignment = `
  DELETE FROM
    student 
  WHERE
    studentId = ${studentId} 
  `
      await database.run(deleteAssignment)
      const getAllAssignment = `SELECT * FROM student`
      const dbResponse = await database.all(getAllAssignment)
      response.send(dbResponse)
    } catch (error) {
      response.send(error)
    }
  },
)

app.post('/assignments', async (request, response) => {
  const {studentId, name, totalScore, dueDate, grade} = request.body
  try {
    const createStudentQuery = `
      INSERT INTO 
       student (studentId,name,totalScore,dueDate,grade) 
      VALUES 
        (
          ${studentId}, 
          '${name}',
          ${totalScore},
          '${dueDate}', 
          '${grade}'
        )`
    const dbResponse = await database.run(createStudentQuery)
    const newUserId = dbResponse.lastID
    response.send(
      `Succesfully submit your assignment with studentId ${newUserId}`,
    )
  } catch (error) {
    response.send('Error in submiting assignment')
  }
})

module.exports = app
