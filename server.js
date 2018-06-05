var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

if (!process.env.CHAT_MONGODB_USER || !process.env.CHAT_MONGODB_PASSWORD) {
    throw "Cannot connect to MDB. No credentials found (CHAT_MONGODB_USER && CHAT_MONGODB_PASSWORD required)"
}

var mongodbuser = process.env.CHAT_MONGODB_USER
var mongodbpass = process.env.CHAT_MONGODB_PASSWORD

app.use(express.static(__dirname))
app.use(bodyParser.json()) //middleware telling express to use this parser
app.use(bodyParser.urlencoded({extended:false}))

mongoose.Promise = Promise

var dbUrl = `mongodb://${mongodbuser}:${mongodbpass}@ds147450.mlab.com:47450/nsio`

var Message = mongoose.model("Message", {
    name: String,
    message: String
})

app.get("/messages", (req, resp) => {
    Message.find({}, (err, messages) => {
        resp.send(messages)
    })
})

app.post("/messages", async (req, resp) => {
    try {
        var m = new Message(req.body)

        var savedMessage = await m.save()
        
        console.log("saved")

        var censored = await Message.findOne({message: "badword"})

        if (censored) {
            await Message.remove({_id : cens.id})
        } else {
            io.emit('message', req.body)
        }
        
        resp.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log("post action called")
    }
})


io.on('connection', (socket) => {
    console.log("user connected")
})

mongoose.connect(dbUrl, (err) => {
    console.log("db connection", err)
})

var server = http.listen(3000, () => {
    console.log(`Listening on port ${server.address().port}`)
})