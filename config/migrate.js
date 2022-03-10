require('dotenv').config()
const PersonalityData = require('../models/personalityData.model')
const Test = require('../models/test.model')
const connectDB = require('./database.config')

const Skill = require('../models/skill.model')

try {
  connectDB()
} catch (err) {
  console.log(err)
}

const fillDbWithFixedPersonalityData = async () => {
  try {
    await PersonalityData.create([
      {
        letter: 'E',
        name: 'Extraverted',
        description:
          'prefer group activities, think while speaking, get energized by social interaction.',
      },
      {
        letter: 'I',
        name: 'Introverted',
        description:
          'prefer solitary activities, think before speaking, get exhausted by social interaction.',
      },
      {
        letter: 'S',
        name: 'Sensing',
        description:
          'down-to-earth, rely on their senses, absorbed in practical matters, focus on what has happened.',
      },
      {
        letter: 'N',
        name: 'Intuitive',
        description:
          'imaginative, rely on their intuition, absorbed in ideas, focus on what might happen.',
      },
      {
        letter: 'T',
        name: 'Thinking',
        description:
          'tough, follow their minds, focus on objectivity and rationality.',
      },
      {
        letter: 'F',
        name: 'Feeling',
        description:
          'sensitive, follow their hearts, focus on harmony and cooperation.',
      },
      {
        letter: 'T',
        name: 'Thinking',
        description:
          'tough, follow their minds, focus on objectivity and rationality.',
      },
      {
        letter: 'F',
        name: 'Feeling',
        description:
          'sensitive, follow their hearts, focus on harmony and cooperation.',
      },
      {
        letter: 'J',
        name: 'Judging',
        description:
          'decisive, prefer clear rules and guidelines, see deadlines as sacred, seek closure.',
      },
      {
        letter: 'P',
        name: 'Perceiving',
        description:
          'very good at improvising, prefer keeping their options open, relaxed about their work, seek freedom.',
      },
    ])
  } catch (err) {
    console.log(err)
  }
}

const fillDbWithFixedTestData = async () => {
  try {
    await Test.create([
      {
        language: 'Javascript',
        level: 1,
        description:
          'function test(params){\n// body\n}\n\nJust write the body in the editor',
        question: [
          {
            title: `<div class="title">Task</div>`,
            body: `<div class="body">This is the body of Task</div>`,
          },
        ],
        testCasesCounter: 3,
        input: JSON.stringify(['John Doe', 'Jane Doe', 'John Smith']),
        result: JSON.stringify([
          'Hello John Doe!',
          'Hello Jane Doe!',
          'Hello John Smith!',
        ]),
      },
    ])
  } catch (err) {
    console.log(err)
  }
}

const test = async () => {
  try {
    await Skill.create({
      skills: { Javascript: 0, Cpp: 0 },
    })
  } catch (err) {
    console.log(err)
  }
}

// test()

// fillDbWithFixedTestData()
// fillDbWithFixedPersonalityData()
