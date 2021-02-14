export default (response, fields = []) => {
  const JSONResponse = response.toJSON()
  fields.forEach(F => delete JSONResponse[F])
  return JSONResponse
}  