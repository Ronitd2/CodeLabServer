const express= require("express");
const mongoose = require('mongoose');
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config();
const AImodelHandler=require("./routehandlers/AImodelroute")
const SignupHandler=require("./routehandlers/Signup")
const LoginHandler=require("./routehandlers/Login")
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const DATABASE=process.env.DATABASE;
//const PORT=process.env.PORT || 8000;
const server = http.createServer(app);


mongoose
    .connect(DATABASE,
    {
        useNewUrlParser : true,
        useUnifiedTopology:true,
    }).then(()=>(console.log("Successfully connected")))
    .catch((err)=>(console.log(err)));

    const io = new Server(server, {
        cors: {
          origin: "https://code-lab-eight.vercel.app",
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
            const usname=users.find(user=>user.email===socket.request._query.uid)
            if(usname)
            {
              if(usname.socketid !== socket.id)
              {
                const index1 = users.findIndex(user => user.email === socket.request._query.uid);
                const index2 = adminlist.findIndex(admin => admin.email === socket.request._query.uid);
                users[index1].socketid=socket.id;
                if(index2!=-1)
                {
                adminlist[index2].socketid=socket.id; 
                }
              }
            }
            socket.on("create_room", (data,callback)=>{
                const useradmin={
                    name:data.name,
                    socketid:socket.id,
                    roomid:data.roomid,
                    email:data.email,
                    access:true
                }
                const admin={
                      name:data.name,
                      socketid:socket.id,
                      email:data.email,
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
                //io.to(data.roomid).emit("receivedusers", {name:data.name,access:useradmin.access,email:data.email});
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
              const sendername=users.find(user=>user.socketid===socket.id && user.roomid==data.roomid)
          
              if(!sendername)
              {
                userobject={
                  name:data.name,
                  socketid:socket.id,
                  roomid:data.roomid,
                  email:data.email,
                  access:false
                }
                users.push(userobject);
              }
              console.log(users);
              io.to(data.roomid).emit("receivedusers", {name:data.name,access:useradmin.access,email:data.email});
              callback({ success: true });
            }
            else{
              callback({ error: 'Room does not exist.' });
            }
            });
          
            socket.on("disconnect",()=>{
              console.log("User disconnected ",socket.id);
            })
            socket.on("logout-user",()=>{
              console.log("Logout process is going on...");
              const isadmin=adminlist.filter(admin=>admin.socketid===socket.id)
              if(isadmin)
              {
                // const roomname=mainroom.find(room=>room===isadmin.roomid)
                // console.log(isadmin);
                // console.log("mainroom delete");
                for(let i=0;i<isadmin.length;i++)
                {
                  // console.log(isadmin[i]);
                  let index = mainroom.indexOf(isadmin[i].roomname);
                  // console.log(index);
                  if (index !== -1) {
                    mainroom.splice(index, 1);
                }
                }
                
              }
              console.log(mainroom);
              for (let i = 0; i < users.length; i++) {
                if (users[i].socketid === socket.id) {
                    users.splice(i, 1);
                    i--; // Decrement i since splice removes an element
                }
            }
            for (let i = 0; i < adminlist.length; i++) {
              if (adminlist[i].socketid === socket.id) {
                  adminlist.splice(i, 1);
                  i--; // Decrement i since splice removes an element
              }
          }
            console.log(users);
            console.log(adminlist);
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
            socket.on("give-permission",(data,callback)=>{
              console.log(data);
              const sendname=users.find(user=>user.name===data.sendername); 
              console.log(sendname);
              if(data.accessmode==true)
                {
                  sendname.access=true;
                  console.log(sendname);
                  
                }
              socket.to(sendname.socketid).emit("getpermission",{access:data.accessmode});
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

    app.get('/',(req,res)=>{
        res.json({"success":'ok'})
    });
    app.use('/aimodel/',AImodelHandler);
    app.use('/signup/',SignupHandler);
    app.use('/login/',LoginHandler);    
          
server.listen(8080, () => {
    console.log("server start at port no 8000");
  });
