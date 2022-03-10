const path = require('path')

class JavaScriptRunner {
  defaultFile = 'test.js'

  constructor(fileName) {
    this.defaultfile = fileName
  }

  getDefaultFile() {
    return this.defaultfile
  }

  testResult(actual = 'undefined', expected, type) {
    switch (type) {
      case 'string': {
        if (actual === expected) {
          return { actual, expected, success: true }
        }
        return { actual, expected, success: false }
      }

      case 'array': {
        if (Array.isArray(actual)) {
          if (actual?.length === expected?.length) {
            for (let i = 0; i < actual.length; i++) {
              const actualElement = actual[i]
              const expectedElement = expected[i]
              if (actualElement !== expectedElement) {
                return { actual, expected, success: false }
              }
            }
            return { actual, expected, success: true }
          }
          return { actual, expected, success: false }
        }
        return { actual, expected, success: false }
      }

      default:
        return
    }
  }

  run(file, test, callback) {
    try {
      const { testingFunction } = require(`./temp/${path
        .basename(file)
        .slice(0, -3)}`)
      // callback(1, testingFunction)
      // return
      const testResult = JSON.parse(test.result)
      const testInput = test.input ? JSON.parse(test.input) : null
      let result = []
      let succeed = true
      for (let i = 0; i < test.testCasesCounter; i++) {
        let caseResult = this.testResult(
          testingFunction(testInput[i]),
          testResult[i],
          typeof testResult[i] === 'string' ? 'string' : 'array'
        )
        result.push(caseResult)
        if (!caseResult.success) {
          succeed = false
        }
      }
      if (succeed) {
        callback(1, result)
      } else {
        callback(2, result)
      }
    } catch (err) {
      callback(-1, err.message)
    }
  }
}

module.exports = JavaScriptRunner
