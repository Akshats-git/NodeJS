const http=require('http')
const fs=require('fs')

const myServer = http.createServer((req,res)=>{
    const log=`${Date.now()}: Request received at ${req.url}.\n`
    fs.appendFile("log.txt",log,()=>{
        res.end("Hello from server")
    })
});

myServer.listen(8000,()=>console.log("Server Started"))

