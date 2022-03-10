const router = require('express').Router()
const TreeNode = require('../DS/Tree/TreeNode')
const helper = (node, key) => {
  if (node.value.includes(key)) {
    return [node]
  } else {
    node.descendants.forEach((zone) => {
      return [node.value, ...helper(zone, key)]
    })
  }
  if (node.value.length === 0) {
    return [0]
  }
}
router.post('/', async (req, res, next) => {
  const JAVASCRIPT = new TreeNode(['javascript', 'js'])
  const JAVA = new TreeNode(['java'])
  const PYTHON = new TreeNode(['python'])
  const CPP = new TreeNode(['c++', 'c plus plus', 'cpp'])
  const OOP = new TreeNode(['object oriented programing', 'oop'])
  const TEST = new TreeNode(['tester', 'testing'])
  const DJANGO = new TreeNode(['django'])
  const FLASK = new TreeNode(['flask'])
  const NODE = new TreeNode(['node', 'nodejs'])
  const EXPRESS = new TreeNode(['express', 'expressjs'])
  const REACT = new TreeNode(['react', 'reactjs'])
  const VUE = new TreeNode(['vue', 'vuejs'])
  const SPRING = new TreeNode(['spring', 'javaspring'])
  OOP.descendants.push(JAVA, CPP)
  JAVASCRIPT.descendants.push(NODE, EXPRESS, REACT, VUE)
  JAVA.descendants.push(SPRING)
  PYTHON.descendants.push(DJANGO, FLASK)
  const DEVELOPER = new TreeNode(['Developer'])
  DEVELOPER.descendants.push(OOP, TEST)
  try {
    const { key, matchWith } = req.body
    const node = helper(DEVELOPER, matchWith)
    if (node) {
      if (node[node.length - 1] === 0) {
        return res.status(404).json({ message: 'Not Found' })
      } else {
        return res.status(200).json(node[node.length - 1])
      }
    } else {
      next('Something went wrong')
    }
    // return res.status(200).json({ message: DEVELOPER.descendants })
  } catch (error) {
    next(error)
  }
})

module.exports = router
