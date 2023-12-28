const express = require("express")
const fs = require("fs")
const { verifyQuestion, middlewareVerification } = require("./utils")
const PORT = 3000
const app = express()
app.use(express.static("./static"))
app.use(express.json())

app.get("/questions",(req,res)=>{
    fs.readFile("./database/questions.json",(err,data)=>{
        if(err)
            return res.status(500).send("error on the server")
        let questions = JSON.parse(data.toString()).questions
        res.status(200).json(questions)
    });
})
app.post("/questions",middlewareVerification,(req,res)=>{
    let {question,answer} = req.body
    fs.readFile("./database/questions.json",(err,dataFile)=>{
        if(err)
            return res.status(500).send("error on the server")
        let data = JSON.parse(dataFile.toString())
        let questionToSave = {
            id:data.lastId,
            question,
            answer
        }
        data.questions.push(questionToSave)
        data.lastId++
        fs.writeFile("./database/questions.json",JSON.stringify(data,null,4),(err)=>{
            if(err)
                return res.status(500).send("error on the server")
            res.status(201).json(questionToSave)
        })
    });
})
app.delete("/questions/:id",(req,res)=>{
    let {id} = req.params
    //let id = req.params.id
    fs.readFile("./database/questions.json",(err,data)=>{
        if(err)
            return res.status(500).send("error on the server")
        let dataFile = JSON.parse(data.toString())
        let questions = dataFile.questions
        let questionIndex = questions.findIndex(ele=>ele.id==id)
        if(questionIndex==-1)
            return res.status(404).send("question not found")
       // questions = questions.filter((ele,index)=>index!=questionIndex)
        dataFile.questions = questions.filter(ele=>ele.id!=id)
        fs.writeFile("./database/questions.json",JSON.stringify(dataFile,null,4),(err)=>{
            if(err)
                return res.status(500).send("error on the server")
            res.status(200).json("question is deleted with success")
        })
    });

})
app.put("/questions/:id",middlewareVerification,(req,res)=>{
    let {id} = req.params
    fs.readFile("./database/questions.json",(err,data)=>{
        if(err)
            return res.status(500).send("error on the server")
        let dataFile = JSON.parse(data.toString())
        let questions = dataFile.questions
        let questionData = questions.find(ele=>ele.id==id)
        if(!questionData)
            return res.status(404).send("question not found")
       let {question,answer} = req.body
       questionData.question=question
       questionData.answer=answer
       fs.writeFile("./database/questions.json",JSON.stringify(dataFile,null,4),(err)=>{
        if(err)
            return res.status(500).send("error on the server")
        res.status(200).json(questionData)
    })
    });
})

app.listen(PORT,()=>console.log("server started at ", PORT))