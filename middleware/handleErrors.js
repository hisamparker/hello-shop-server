const notFound = ((req, res, next) => {
    // 404s don't throw an error in express, so we create a new error instance and define it
    const error = new Error(`We can't find anything at ${req.originalUrl}`)
    res.status(404)
    next(error)
})

// must be below app.use routes or we don't hit it!
const errorHandler = ((err, req, res, next) => {
    // sometimes we still get an error even w status 200, so we plan for this
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })

})

export {notFound, errorHandler}