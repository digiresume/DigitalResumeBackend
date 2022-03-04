exports.getPrivateData = (req,res,next) =>{
    res.status(200).json({
        success: true,
        data:"You got acess to the pivate data in this route",
    })
}