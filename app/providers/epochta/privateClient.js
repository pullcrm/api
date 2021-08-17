import epocthaAPI from 'epochta-client-pullcrm'

export default keys => {
  console.log(
    'PRIVATE CLIENT KEYS',
    keys
  )
  return new epocthaAPI(keys, false, true)
}