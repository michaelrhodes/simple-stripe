# simple-stripe

simple-stripe is an isomorphic client for the [Stripe API](https://stripe.com/docs/api)

## install

```sh
npm install michaelrhodes/simple-stripe
```

## use

```js
var stripe = require('simple-stripe')({
  key: process.browser ?
    process.env.PUBLISHABLE_API_KEY :
    process.env.SECRET_API_KEY
})

var card = {
  tokenify: stripe('POST /tokens')
}

var details = {
  'card[number]': '4242424242424242',
  'card[exp_month]': 12,
  'card[exp_year]': 2018,
  'card[cvc]': '123'
}

card.tokenify(details, (err, json) {
  err ? console.error(err) : console.log(json)
})
```

## obey

[MIT](http://opensource.org/licenses/MIT)
