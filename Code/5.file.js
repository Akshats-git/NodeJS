const fs=require("fs")

// Sync
fs.writeFileSync("./test.txt","Hello World")

// Async
fs.writeFileSync("./test.txt","Hello World",(err)=>{})

const result = fs.readFileSync("./names.txt","utf-8")
console.log(result)

fs.readFile("./names.txt","utf-8",(err,data)=>{
    if(err)
        console.log("Some error occured: ",err)
    else 
        console.log(data)
})

// used for appending
fs.appendFileSync("./names.txt",`\nHey! Here at ${Date.now()}`)

// used to make a copy
fs.cpSync("names.txt","copy.txt")

// used for deleting a file
fs.unlinkSync("./copy.txt")

// gives various stats
console.log(fs.statSync("./test.txt"))



