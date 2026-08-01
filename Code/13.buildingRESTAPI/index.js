const express = require('express')
const fs = require('fs')
const users = require('./MOCK_DATA.json')
const mongoose = require("mongoose");
const { brotliDecompressSync } = require('zlib');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error", err));

const app = express()
const PORT = 8000

const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    job_title:{
        type: String,
    },
    gender:{
        type: String,
    }
},{timestamps:true})

const User = mongoose.model("user",userSchema)

app.use(express.urlencoded({extended:false}))

app.get('/users',async (req,res)=>{
    const allDbUsers = await User.find()
    const html = `
    <ul>
        ${allDbUsers.map((user)=>`<li>${user.first_name} - ${user.email}</li>`).join("")}
    </ul>
    `;
    return res.send(html)
})

app.get('/api/users',(req,res)=>{
    return res.json(users)
})

// app.get('/api/users/:id',(req,res)=>{
//     // need to convert from string to number
//     const id = Number(req.params.id);
//     const user = users.filter((user)=>(user.id===id))
//     return res.json(user)
// })

app.get('/api/users/:id',async (req,res)=>{
    // need to convert from string to number
    const id = Number(req.params.id);
    // const user = users.find((user)=>(user.id===id))
    const user = await User.findById(req.params.id);
    if(!user)
    return res.status(404).json({message:"User not found"})
    return res.json(user)
})

app.post('/api/users',async (req,res)=>{
    const body = req.body;
    // users.push({...body,id:users.length+1})
    // fs.writeFile('MOCK_DATA.json', JSON.stringify(users), (err) => {
    //     return res.json({status:"success",id:users.length})
    // })
    const result = await User.create({
        first_name:body.first_name,
        last_name:body.last_name,
        email:body.email,
        gender:body.gender,
        job_title:body.job_title
    })
    return res.status(201).json({msg:"Successfully added user."})
})

app.patch('/api/users/:id',(req,res)=>{
    return res.json()
})

app.delete('/api/users/:id',(req,res)=>{
    return res.json()
})

// OR
// app.route('/api/users/:id')
//     .get((req,res)=>{
//         return res.json()
//     })
//     .patch((req,res)=>{
//         return res.json()
//     })
//     .delete((req,res)=>{
//         return res.json()
//     })  

app.listen(PORT,()=>{
    console.log("Server started")
})