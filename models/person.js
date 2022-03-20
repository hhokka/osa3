const mongoose = require('mongoose')

/* eslint-disable */
const url = process.env.MONGODB_URI;
/* eslint-enable */

console.log('connecting to', url)
mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

function regExValidator(val) {
  let text = val
  let pattern = /^[0-9]{2,3}-[0-9]*$/g
  let result = text.match(pattern)
  if (result) {
    return true
  } else {
    return false
  }
}

function lengthValidator(val) {
  return val.length > 7
}
/* const customValidate = [
  regExValidator,
  "validation of `{PATH}` failed with value `{VALUE}`",
]; */
const many = [
  { validator: regExValidator, msg: 'Number in wrong format' },
  { validator: lengthValidator, msg: 'Number too short' },
]
const personSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
    validate: many,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
