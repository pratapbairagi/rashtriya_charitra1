const express = require("express")
const app = express()
const path = require("path")
// const http = require("http").Server(app) // also working
const server = require("http").createServer(app)
const cors = require("cors")
const port = 5000


let devices = [] // device container
let user_names = [] // user names container

let ids = {} // working to use ids[socket.io]
let users = {} // working to use users[socket.io]
let device = {} // working to use device[socket.io]

let individual_device={} // device store for individual user


/////// messages ///////
let messages = []
let message = {}
let from_name ={}
let from_id ={}
let from_device ={}
let time_stamp ={}
let to={}




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
    console.log("user_names0",user_names)


    // for login page
    // device ids container
    socket.on("send_device_id", ({device_ls})=>{

     if(device_ls!==undefined && device_ls !==null && devices.map(val=>val.devices).toString().includes(device_ls)===false){ 
        devices.push({devices:device_ls})
         io.emit("receive_all_devices", {devices})

        /// whenever this function will return device id
        // stored user_names will emit users name
        io.emit("receive_user_input", {users:user_names})
        console.log("user_names1",user_names)

        // updating messages
        io.emit("rec_public_messages", {all_public_message:messages})

    }
    else{
         /// whenever this function will return device id
         // even, if no new device fount
        // stored user_names will emit users name
        io.emit("receive_user_input", {users:user_names})
        io.emit("receive_all_devices", {devices})
        console.log("user_names2",user_names)

         // updating messages
         io.emit("rec_public_messages", {all_public_message:messages})

    }
    })
    // end device container

    // start sending user names when user submits name
    socket.on("send_user_input", ({deviceId,name,id})=>{
        users[socket.id]= name
        ids[socket.id]=id
        devices[socket.id]=deviceId
        if(name!==undefined && name !==null && user_names.map(val=>val.user_devices).toString().includes(deviceId)===false){
            // one_user_name=users[socket.id]
            // one_user_id= ids[socket.id]
            // one_user_device= devices[socket.id]
        user_names.push({user_names:users[socket.id], user_ids:ids[socket.id],user_devices:devices[socket.id]})
        
        io.emit("receive_user_input", {users:user_names})
        one_user_detail=users[socket.id]
        console.log("user_names3",user_names)

         // updating messages
         io.emit("rec_public_messages", {all_public_message:messages})

        }else{
            // if no new user fount
            // this will emit old stored user names
            io.emit("receive_user_input", {users:user_names})
        console.log("user_names4",user_names)

         // updating messages
         io.emit("rec_public_messages", {all_public_message:messages})
        }
    })

    socket.on("send_individual_device_id", ({individual_device_id})=>{
        device[socket.id]=individual_device_id
        individual_device= device[socket.id]
        socket.emit("receiving_individual_device_id", {rec_individual_device:individual_device})

         // updating messages
         io.emit("rec_public_messages", {all_public_message:messages})
    })

    socket.on("send_individual_name", ({user_name,user_id,user_device_id})=>{
        users[socket.id]= user_name
        ids[socket.id] = user_id
        device[socket.id] = user_device_id
        socket.emit("receive_individual_name", {user_name:users[socket.id], user_id:ids[socket.id], user_device_id:device[socket.id]})
        console.log("user_names5",user_names)

    })

    socket.on("exit_user", ({user_name,user_id})=>{
        users[socket.id]= user_name
        ids[socket.id]= user_id
       user_names=user_names.filter(val=>val.user_names!=users[socket.id])
        // io.emit("rec_updated", {user_names:user_names.filter(val=>val.user_names!=users[socket.id])})
        io.emit("rec_updated_users", {user_names:user_names})
        console.log("user_names6",user_names)


         // updating messages
         io.emit("rec_public_messages", {all_public_message:messages})

    })

    socket.on("exit_device", ({device_id})=>{
        // if(devices.map(val=>val.devices).toString().includes(device_id)===true){
        device[socket.id]=device_id
        devices=devices.filter(val=>val.devices!=device[socket.id])///////
        // io.emit("rec_device_update", {devices:devices.filter(val=>val.devices!=device[socket.id])})
        io.emit("rec_device_update", {devices:devices})
        individual_device={}
        socket.emit("receiving_individual_device_id", {rec_individual_device:individual_device})

         // updating messages
         io.emit("rec_public_messages", {all_public_message:messages})
    })
    // end

    ////////////////////////// messages //////////////////////////
    socket.on("send_public_messages", ({public_message, from_user_name,from_user_id, from_device_id, to,time})=>{
        if(public_message.length>0){
        message[socket.id]=public_message
        from_name[socket.id]=from_user_name
        from_id[socket.id]=from_user_id
        from_device[socket.id]=from_device_id
        time_stamp[socket.id]=time
        to[socket.id]=to
        console.log("time",time_stamp[socket.id])
        messages.push({public_message:message[socket.id], from_user_name:from_name[socket.id],from_user_id:from_id[socket.id], from_device_id:from_device[socket.id], to:to[socket.id],time:time_stamp[socket.id]})
        io.emit("rec_public_messages", {all_public_message:messages})
        }


        

    })


 
    
    // // for login

    
        
    

    // // recieved the user name from client side
    // // socket.on("visitor", ({visitor_name,id})=>{
    // //     users[socket.id]=visitor_name
    // //     console.log(visitor_name)
    // //     // send the name and id to all clients(client side)
    // //    io.emit("enter_user",{user:users[socket.id], id:socket.id})
    // // })
    //     // receiving updated user_names and ids from client side
    // // socket.on("send_updated_users", ({user,id})=>{
    // //     users[socket.id]=user
        
    // //     // again sending the update user-names and ids to all clients(client side)
    // //     io.emit("rec_updated_users", {all_users:users[socket.id], id:id})
    // // })

    // // receiving messages, ids from client side
    // // socket.on("message_ready", ({message,id})=>{
    // //     // sending messages and id s to the all users(client side) 
    // //     io.emit("message_send",{name:users[socket.id],id:socket.id,messages:message})
    // //     console.log(message)
    // // })

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