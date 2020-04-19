export default {
  index: (req, res, next) => {
    try {
      res.send([])
    } catch(error) {
      next(error)
    }
  }
}
