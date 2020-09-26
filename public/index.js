//Price
const confertPrice = (price) => {
    return new Intl.NumberFormat('USD', {
        currency: 'USD',
        style: 'currency'
    }).format(price)
}

const prices = document.querySelectorAll('.price_itself')
prices.forEach(price => {
    price.textContent = confertPrice(price.textContent)
})
// ------------------------

// Validation
const inputRating = document.querySelector('#rating')
if(inputRating) {
    inputRating.addEventListener('input', event => {
        let value = event.target.value
        inputRating.value = value.replace(/\D/gi, '')
        inputRating.value = +inputRating.value > 10 ? '' : inputRating.value
        inputRating.value = inputRating.value.length >= 2 && inputRating.value != 10 ? '' : inputRating.value
    })
}
// ----------------------------------

M.Tabs.init(document.querySelectorAll('.tabs'))