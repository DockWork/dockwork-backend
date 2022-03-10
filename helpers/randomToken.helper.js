const charactersToBeChosenFrom = '0123456789abcdefghijklmnopqrstuvwxyz'

const generateRegistrationToken = () => {
  let token = ''
  for (let i = 0; i < 50; i++) {
    token +=
      charactersToBeChosenFrom[
        Math.floor(Math.random() * charactersToBeChosenFrom.length)
      ]
  }
  return token
}

module.exports = { generateRegistrationToken }
