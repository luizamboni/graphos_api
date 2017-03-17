"use strong"

const _ = require("underscore")

const castTo = {
  user_id: x => x,
  id: parseInt,
  price: parseFloat
}

module.exports = (q) => (

  _.each(q ,(v,k) => {
    q[k] = castTo[k](v)
  })
)