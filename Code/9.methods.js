const http=require('http')
const fs=require('fs')
const url=require('url')
const { listenerCount } = require('cluster')

const server = http.createServer((req,res)=>{
    if(req.url=="/favicon.ico") return res.end()
    const log = `${Date.now()}: Request at ${req.url}\n`
    const myUrl = url.parse(req.url,true)
    fs.appendFile("log.txt",log,(err)=>{
        switch(myUrl.pathname){
            case '/':
                res.end("Welcome to Home Page")
                break;
            case '/about':
                const username=myUrl.query.username;
                res.end(`Welcome ${username}`)
                break
            case '/search':
                const search=myUrl.query.search_query;
                res.end(`Here are the results for ${search}`)
                break
            case '/signup':
                if(req.method==="GET")
                    res.end("Signup Page")
                else if(req.method==="POST")
                    // DB Query
                    res.end("Signup Successful")
                break
            default:
                res.end("404 Not Found")
        }
    })
})

server.listen(8000,()=>{console.log("Server Started");
})