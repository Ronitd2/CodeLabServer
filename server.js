const express= require("express");
const AImodelHandler=require("./routehandlers/AImodelroute")
const SignupHandler=require("./routehandlers/Signup")
const LoginHandler=require("./routehandlers/Login")
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({"success":'ok'})
});
app.use('/aimodel/',AImodelHandler);
app.use('/signup/',SignupHandler);
app.use('/login/',LoginHandler);

module.exports = app;


const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = require("./server");

const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const adminlist=[];
      const users=[];
      const mainroom=[];
      //recieving event 
      io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);
        console.log(socket.request._query);
        socket.on("create_room", (data,callback)=>{
            const useradmin={
                name:data.name,
                socketid:socket.id,
                access:true
            }
            const admin={
                  name:data.name,
                  socketid:socket.id,
                  roomname:data.roomid
            }
            const existroom=mainroom.find(element=>element===data.roomid);
            if(!existroom)
            {
            adminlist.push(admin);
            mainroom.push(data.roomid);
            users.push(useradmin);
            socket.join(data.roomid);
            console.log(adminlist);
            console.log(users);
            callback({ success: true });
            }
            else{
              callback({ error: 'Room already exists.' });
            }
        })
      
        socket.on("join_room", (data,callback) => {
          const existroom=mainroom.find(element=>element===data.roomid);
          if(existroom)
          { 
          socket.join(data.roomid);
          
          //users=[...users,userobject];
          const sendername=users.find(user=>user.socketid===socket.id)
      
          if(!sendername)
          {
            userobject={
              name:data.name,
              socketid:socket.id,
              access:false
            }
            users.push(userobject);
          }
          console.log(users);
          callback({ success: true });
        }
        else{
          callback({ error: 'Room already exists.' });
        }
        });
      
        socket.on("disconnect",()=>{
          console.log("User disconnected ",socket.id);
        })
        socket.on("logout-user",()=>{
          console.log("Logout process is going on...");
          for (let i = 0; i < users.length; i++) {
            if (users[i].socketid === socket.id) {
                users.splice(i, 1);
                i--; // Decrement i since splice removes an element
            }
        }
        console.log(users);
        })
        socket.on("adduser",userid=>{
          //const isexist=users.find(users.userid===userid)
          // if(!isexist)
          // {
            const user={userid,socketId:socket.id};
            users.push(user);
            console.log(users);  
        })
        socket.on("send_message", (data) => {
          const reciver=users.find(user=>user.userid===data.reciverid);
          socket.to(reciver.socketId).emit("receive_message", data);
        }); 
        socket.on("room_message", (data) => {
          console.log(data)
          const sendername=users.find(user=>user.socketid===socket.id);
          console.log(sendername);
          io.to(data.roomid).emit("receive_message", {message:data.message,socketId:socket.id,sender:sendername.name});
        });
      
        socket.on("access-permission",(data)=>{
          const admin=adminlist.find(admins=>admins.roomname===data.roomid);
          console.log(data);
          console.log(admin);
          socket.to(admin.socketid).emit("getaccess",{accesssender:data.name});
        });
        socket.on("give-permission",(data)=>{
          console.log(data);
          const sendname=users.find(user=>user.name===data.sendername); 
          console.log(sendname);
          if(data.accessmode==true)
            {
              sendname.access=true;
              console.log(sendname);
            }
          //socket.to(sendname.socketid).emit("getpermission",{access:data.accessmode});
        });
        socket.on("leave-permission",(data)=>{
          const people=users.find(user=>user.name===data.name);
          console.log(people); 
          people.access=false;
        })
        socket.on("editorcode", (data) => {
      
          console.log(data);
          const userman=users.find(user=>user.socketid===socket.id); 
          console.log(userman);
          if(userman.access==true)
          {
          socket.broadcast.to(data.roomid).emit('receivedcode', data.newValue);
          }
          //io.to(data.roomid).emit("receive_message", {message:data.message,socketId:socket.id});
        });
      });

