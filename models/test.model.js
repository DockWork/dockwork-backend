const mongoose = require('mongoose')
const { Schema, model } = mongoose

const testSchema = new Schema(
  {
    language: { type: String, trim: true, required: true },
    level: { type: Number, required: true },
    description: { type: String, required: true },
    question: { type: Array, required: true },
    testCasesCounter: { type: Number, required: true },
    input: { type: String, required: false },
    result: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const TestModel = model('Test', testSchema)
module.exports = TestModel
