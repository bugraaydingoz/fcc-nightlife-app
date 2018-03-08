const express = require('express')
const router = express.Router()

const yelp = require('yelp-fusion')
const yelpConfig = require('../config/yelp-config')
const client = yelp.client(yelpConfig.apiKey)

const Bar = require('../models/bar')
const mongoose = require('mongoose')
const mongooseConfig = require('../config/mongoose-config')
mongoose.connect(mongooseConfig.connectionString, {
  useMongoClient: true
})
mongoose.Promise = global.Promise

router.get('/test', (req, res) => {
  console.log(req.cookies)
  res.send('it works')
})

// GET /search/:city
router.get('/search/:city', (req, res) => {
  const searchRequest = {
    location: req.params.city,
    categories: 'bars'
  }

  client
    .search(searchRequest)
    .then(response => {
      const businesses = response.jsonBody.businesses

      let businessArray = []
      try {
        businesses.forEach(b => {
          // find who is going that bar
          let _usersGoing = []
          try {
            Bar.findOne(
              {
                businessId: b.id
              },
              (err, result) => {
                if (err) throw err

                if (result) _usersGoing = result.usersGoing
              }
            )
          } catch (error) {
            throw error
          }

          businessArray.push({
            businessId: b.id,
            imageUrl: b.image_url,
            title: b.name,
            url: b.url,
            displayAddress: b.location.display_address,
            usersGoing: _usersGoing
          })
        })
      } catch (error) {
        throw error
      }

      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(businessArray))
    })
    .catch(e => {
      console.log(e)
      res.end()
    })
})

// POST /mark
// Toggle whether user is going to bar from bars table.
router.post('/mark', (req, res) => {
  const _userId = req.body.userId
  const _businessId = req.body.businessId

  // console.log(_userId)
  // console.log(_businessId)

  try {
    Bar.findOne(
      {
        businessId: _businessId
      },
      (err, result) => {
        if (err) throw err

        if (!result) {
          // if there is no such bar in table, create one

          let _usersGoing = [_userId]
          let _bar = new Bar({
            businessId: _businessId,
            usersGoing: _usersGoing
          })

          _bar.save((err, result) => {
            res.send(result)
          })
        } else {
          // if there is bar, update it
          let _bar = result
          let _user = _bar.usersGoing.find(o => o === _userId)

          if (_user) {
            // if user is in the array, remove...
            _bar.usersGoing.splice(_bar.usersGoing.indexOf(_userId), 1)
          } else {
            //...otherwise, push it
            _bar.usersGoing.push(_userId)
          }

          // finally update bar table
          Bar.update(
            {
              businessId: _businessId
            },
            _bar,
            (err, result) => {
              if (err) throw err

              res.setHeader('Content-Type', 'application/json')
              res.send(JSON.stringify(_bar))
            }
          )
        }
      }
    )
  } catch (error) {
    throw error
  }
})

// GET /:businessId/users
router.get('/:businessId/users', (req, res) => {
  const _businessId = req.params.businessId

  try {
    Bar.findOne(
      {
        businessId: _businessId
      },
      (err, bar) => {
        if (err) throw err

        if (bar && bar.usersGoing) {
          res.setHeader('Content-Type', 'application/json')
          res.send(JSON.stringify(bar.usersGoing))
        } else {
          res.setHeader('Content-Type', 'application/json')
          res.send(JSON.stringify(null))
        }
      }
    )
  } catch (error) {
    throw error
  }
})

module.exports = router
