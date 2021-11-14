const express = require("express")
const app = express()
const path = require("path")
// const http = require("http").Server(app) // also working
const server = require("http").createServer(app)
const cors = require("cors")
const port = 5000


let users_html = {}
let devices = {}
let ids = {}
let users = {}


// const server = http.createServer(app)
// const io = require("socket.io")(http) // it works with const http = require("http").Server(app)
const io = require("socket.io")(server)

app.use(cors())

app.get("/", (req,res)=>{
    // res.sendFile(__dirname+"/index.html")
    res.send("hellow")

})

// here socket.io runs first time
io.on("connection", (socket)=>{
    console.log(socket.id)
    console.log("new connection")

    // new user enter in html client
    // socket.on("name_register",({name_,id_})=>{
    //     console.log(name_)
    //     users_html[socket.id]=name_
    //     io.emit("entered_name", {u_name:users_html[socket.id], id:socket.id})
    // })


    // for login page
    socket.on("send_user_input", ({deviceId,name,id})=>{
        users[socket.id]= name
        ids[socket.id]=id
        devices[socket.id]=deviceId
        socket.emit("receive_user_input", 
        {
            user:users[socket.id],
            id:ids[socket.id],
            device:devices[socket.id]
        })
    })

    socket.on("send_all_user_pool",({user_name,user_id,device_id})=>{
        devices[socket.id]=device_id
        ids[socket.id]=user_id
        users[socket.id]=user_name
        console.log("all users--->>",user_name)
        io.emit("receive_all_users_pool", {user_names:users[socket.id],user_ids:ids[socket.id],device_ids:devices[socket.id]})
    })
    // for login

    
        
    

    // recieved the user name from client side
    // socket.on("visitor", ({visitor_name,id})=>{
    //     users[socket.id]=visitor_name
    //     console.log(visitor_name)
    //     // send the name and id to all clients(client side)
    //    io.emit("enter_user",{user:users[socket.id], id:socket.id})
    // })
        // receiving updated user_names and ids from client side
    // socket.on("send_updated_users", ({user,id})=>{
    //     users[socket.id]=user
        
    //     // again sending the update user-names and ids to all clients(client side)
    //     io.emit("rec_updated_users", {all_users:users[socket.id], id:id})
    // })

    // receiving messages, ids from client side
    // socket.on("message_ready", ({message,id})=>{
    //     // sending messages and id s to the all users(client side) 
    //     io.emit("message_send",{name:users[socket.id],id:socket.id,messages:message})
    //     console.log(message)
    // })

    socket.on("disconnect", ()=>{
        console.log("user left")
    })
})

server.listen(port, ()=>{
    console.log(`listen server http://localhost:${port}`)
})


























































// let users_device = {}
// let users_id = {}
// let users_name = {}
// let updated = []





// ///// for login page
// socket.on("get_users_pool", ({deviceId,name,id})=>{
//     users_device[socket.id]=deviceId
//     users_id[socket.id]=id
//     users_name[socket.id]=name
//     updated.push({name:users_name[socket.id]=name,id:users_id[socket.id]=id,device:users_device[socket.id]})
    
//     console.log(updated)
//     io.emit("sent_users_pool", {updated:updated})
//     console.log("device id", deviceId)
//     console.log(device)
// })
// /// for login