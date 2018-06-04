var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json()) //middleware telling express to use this parser
app.use(bodyParser.urlencoded({extended:false}))

var messages = [
    {name:"tomek", message: "msg"},
    {name:"tomek2", message: "msg2"}
]

app.get("/messages", (req, resp) => {
    resp.send(messages)
})

app.post("/messages", (req, resp) => {
    messages.push(req.body)
    io.emit('message', req.body)
    resp.sendStatus(200)
})

io.on('connection', (socket) => {
    console.log("user connected")
})

var server = http.listen(3000, () => {
    console.log(`Listening on port ${server.address().port}`)
})