const asyncHandeler = (fn) => async(req,res,next)=>{
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status( 404).json({
            success:false,
            message:error.message
        })
    }
}

export { asyncHandeler }