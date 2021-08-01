import epocthaAPI from 'epochta-client-pullcrm'

export default async keys => {
  const client = new epocthaAPI(keys, false, true)

  try {
    await client.getBalance()

    return client
  } catch {
    // TODO: Change isValid to false on DB for this company sms settings
    client.isValid = false

    return client
  }
}