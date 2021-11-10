import React, { useEffect } from "react"
import RC from "./RC.png"
import { useDispatch , useSelector } from "react-redux"
import User_details_action from "../redux/actions"
import { User_name_action } from "../redux/actions"
import { useState } from "react"
import socketIO from "socket.io-client"

const ENDPOINT = "http://localhost:5000/"
let socket
// import { useState } from "react"

// const app = {
//     header: ["home", "about"],
//     banner_image: "/banner/1.png",
//     user_array: ["Ram", "shyam", "Sita", "Geeta"],
//     message_board:[
//         { id: 1, content: "hello world 1", from: "Ram", to: "public", time_stamp: "10:30", },
//         { id: 2, content: "hello world 2", from: "Shyam", to: "public", time_stamp: "10:34", },
//         { id: 3, content: "hello world 3", from: "Sita", to: "public", time_stamp: "10:45", },
//         { id: 4, content: "hello world 4", from: "Geeta", to: "public", time_stamp: "11:01", },
//         { id: 5, content: "hello world 5", from: "Ram", to: "public", time_stamp: "11:07", }
//     ],
// }



const User_register = () => {

    const [users, setUsers] = useState()
    const [updateUsers, setUpdateUsers] = useState([])

    
     

    const dispatch = useDispatch()
    const stored_value = useSelector(val=>val)
    console.log(stored_value)
    const messages= stored_value.user_details.message_board
    const user_name = stored_value.user_details.user_array

    console.log(messages)
    // console.log(user_name.map(val=>val))
    // const userName= stored_value.user_details.user_array

   
    

    const submitName = () => {
        var register_name = document.getElementById("name_register_input").value
        dispatch(User_name_action(register_name))
        document.getElementById("name_register_input").value=""

        socket = socketIO(ENDPOINT, {transports:['websocket']})
        socket.on("connect", async()=>{
            alert("new connection")
            console.log(socket.id)

           await socket.emit("visitor", {visitor_name:register_name,id:socket.id})

           await socket.on("enter_user",(data)=>{
                console.log(data)
                setUsers( data)
                console.log(users)
            })

            console.log(users)
            return ()=>{
                socket.emit("disconnect")
                socket.off()
            }
        })
    }

    useEffect(()=>{
        // socket.on("enter_user",(data)=>{
        //     console.log(data)
        //     setUsers([...users, data])
        // })
            setUpdateUsers([...updateUsers,users])
        console.log(users)
        return ()=> socket.off()
    },[users])

    let [id,setId] = useState(0)
    
    const sendMessage = () => {
        var date= new Date()
    var day = date.getDay()
    var month = date.getMonth()
    var hr = date.getHours()
    var min = date.getMinutes()
    var sec = date.getSeconds()
    var time = hr+":"+min+":"+sec+" "+day+"/"+month
    // const name = user_name.map(val=>val.name)
        setId(id++)
        var message = document.getElementById("message_input").value
        if(message.length>0){
            var name = document.getElementById("name_register_input").value
        dispatch(User_details_action(message,id,name,time))
        document.getElementById("message_input").value =""
        }
        
    }

    // const name = user_name.map(val=>val.name)
    // console.log()

    // useEffect(()=>{

    //     socket = socketIO(ENDPOINT, {transports:['websocket']})
    //     socket.on("connect",()=>{
    //         alert("new connection")
    //         console.log(socket.id)

    //         return ()=>{
    //             socket.emit("disconnect")
    //             socket.off()
    //         }
    //     })
    // },[name])
    
    return (
        <div style={{ width: "95%", minWidth:"320px", minHeight: "100vh", padding:"2%", margin:"0 auto" }}>
            <div style={{ width: "25%", minWidth:"180px", minHeight:"150px", height:"20%", margin: "0 auto" , display:"flex", flexDirection:"column" }}>

                <div style={{width:"70%", margin:"0 auto"}}>
                    <img style={{ width: "100%" }} src={RC} alt="loading..." />
                </div>
            
                <div style={{width:"100%", marginTop:"2%"}}>
                   <input type="text" defaultValue="" id="name_register_input" />
                   <br/>
                   <label htmlFor="name_register_input">Register your name</label>
                   <br/>
                    <button onClick={submitName}>Submit</button>
                </div>
            </div>

            <div style={{ width: "80%", margin:"1% auto", display:"flex" , border:"1px solid grey" , padding:"1px" }}>
                {updateUsers.map((val,i)=>{
                    return <div style={{marginLeft:"5px", background:"green", padding:`${i>0?"2px":"none"}`, borderRadius:"5px", color:"white", fontWeight:"bold"}} key={i}>{i>0?val.name:null}</div>
                })}
            </div>

            <div style={{width:"80%", margin:"0 auto",marginTop:"2%", height:"60vh", overflowY:"auto", padding:"2%",border:"1px solid black"}}>
                {messages.map((val,i)=>{
                return <div style={{ background:"pink", color:"black", marginTop:"1%", textAlign:"left", padding:`${i>0?"2px":"0"}`, borderRadius:"5px"}} key={i}> {val.from} {i>0?":":null} {val.content} {i>0?<br/>:null} {val.time_stamp}</div>
                })}
            </div>

            <div style={{ width: "80%", minWidth:"260px", display: "flex", margin:"0 auto", marginTop: "2%", minHeight: "5vh", border:"1px solid black", height:"10%", padding:"1%" }}>
                <div style={{ width: "60%", minWidth:"250px", display: "flex", flexDirection: "column", margin:"0 auto", padding: "2%" }}>
                    <input id="message_input" type="text" defaultValue="" />
                    <label htmlFor="message_input">Type your message</label>
                    <button style={{ width: "min-content", margin:"1% auto" }} onClick={sendMessage}>Send</button>
                </div>
            </div>

        </div>
    )
}
export default User_register
