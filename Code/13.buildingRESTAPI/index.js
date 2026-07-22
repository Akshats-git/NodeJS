const express = require('express')
const fs = require('fs')
const users = require('./MOCK_DATA.json')

const app = express()
const PORT = 8000

app.use(express.urlencoded({extended:false}))

app.get('/users',(req,res)=>{
    const html = `
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
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

app.get('/api/users/:id',(req,res)=>{
    // need to convert from string to number
    const id = Number(req.params.id);
    const user = users.find((user)=>(user.id===id))
    if(!user)
    return res.status(404).json({message:"User not found"})
    return res.json(user)
})

app.post('/api/users',(req,res)=>{
    const body = req.body;
    users.push({...body,id:users.length+1})
    fs.writeFile('MOCK_DATA.json', JSON.stringify(users), (err) => {
        return res.json({status:"success",id:users.length})
    })
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