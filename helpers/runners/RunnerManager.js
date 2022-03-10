const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const JavaScriptRunner = require('./JavaScriptRunner')
const { v4: uuidv4 } = require('uuid')
const Skill = require('../../models/skill.model')
const User = require('../../models/user.model')

const getDirName = path.dirname

function Factory() {
  this.createRunner = function createRunner(lang, fileName) {
    switch (lang) {
      case 'javascript':
        return new JavaScriptRunner(fileName)
      default:
        return
    }
  }
}

function saveFile(file, code, callback) {
  // create parent directories if they doesn't exist.
  mkdirp(getDirName(file))
    .then(() => {
      return fs.writeFile(file, code, (err2) => {
        if (err2) {
          throw err2
        }

        callback()
      })
    })
    .catch((err) => {
      return callback(err)
    })
}

module.exports = {
  run(lang, code, test, req, res) {
    const factory = new Factory()
    const runner = factory.createRunner(lang.toLowerCase(), `${uuidv4()}.js`)

    const directory = path.join(__dirname, 'temp')
    const file = path.join(directory, runner.getDefaultFile())

    const restricted = /require\b|import\b|process\b/
    if (restricted.test(code)) {
      return res.status(400).json({ status: -1, message: 'Error' })
    }
    let newCode = 'const testingFunction=(params)=>{\n'
    newCode += code
    newCode += '\n}\nmodule.exports= { testingFunction }'
    saveFile(file, newCode, () => {
      runner.run(file, test, async (status, message) => {
        fs.unlink(file, (err2) => {
          if (err2) {
            throw err2
          }
          console.log('File deleted!')
        })
        if (status === 1) {
          try {
            const userSkills = await Skill.findOne({ _id: req.user.skills })
            if (!userSkills) {
              const newSkill = await Skill.create({
                skills: { [lang]: test?.level },
              })
              await User.updateOne(
                { _id: req.user._id },
                { skills: newSkill._id }
              )
            } else {
              await Skill.updateOne(
                { _id: userSkills._id },
                { skills: { ...userSkills.skills, [lang]: test?.level } }
              )
            }
          } catch (err) {
            console.log(err)
            return res.status(500).json({ message: 'Something went wrong' })
          }
        }
        const result = {
          status,
          message,
        }
        return res.status(200).json(result)
      })
    })
  },
}
