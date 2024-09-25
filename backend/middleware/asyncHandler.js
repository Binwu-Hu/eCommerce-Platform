const asyncHandler = (fn) => (req, res, next) => {
  //if promise resolves, call next middleware
  Promise.resolve(fn(req, res, next)).catch(next)
}

export default asyncHandler
