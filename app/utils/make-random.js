/*
  Generate random string/characters
  https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
*/
export function makeRandom (length, {type}) {
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  if (type === 'numeric') {
    characters = '0123456789'
  }

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}
