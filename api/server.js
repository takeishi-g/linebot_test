'use strict'

const express = require('express')
const line = require('@line/bot-sdk')
const PORT = process.env.PORT || 3000
require('dotenv').config()

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken:process.env.CHANNEL_ACCESS_TOKEN
}
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken:process.env.CHANNEL_ACCESS_TOKEN
})

const app = express()

app.get('/', (req, res) => res.json('Hello LINE BOT!'))

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err)
      res.status(500).end()
    })
})


async function handleEvent(event) {
  console.log(event)
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }

  const echo = { type: 'text', text: event.message.text }

  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [echo]
  })
}

app.listen(PORT, () => console.log(`Server ruuning at ${PORT}`))

// (process.env.NOW_REGION) ? module.exports = app : app.listen(PORT)
// console.log(`Serveruuning at ${PORT}`)