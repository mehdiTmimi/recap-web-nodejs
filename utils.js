const verifyQuestion = (question,answer)=>{
    if(!question)
        return {state:false, msg:"question is required"}
    if(question.indexOf("?")==-1)
        return {state:false, msg:"question must contains '?'"}
    if(question.length<=4)
        return  {state:false, msg:"question must contains at least 4 caracters"}

    if(typeof(answer)!='boolean')
        return  {state:false, msg:"answer must be a boolean value"}

    return {state:true, msg:""}
}
const middlewareVerification  = (req,res,next)=>{
    // refaire la verification
    let {question,answer} = req.body
    let {state,msg} = verifyQuestion(question,answer)
    if(state)
        return next()
    res.status(400).send(msg)
}
module.exports={
    verifyQuestion,
    middlewareVerification
}