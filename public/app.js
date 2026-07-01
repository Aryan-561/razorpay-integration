
const amountInput = document.getElementById('amount')
const payButton = document.getElementById('pay-btn')
const msg = document.getElementById('message')
const form = document.querySelector('form')

const setMessage = (type, text) => {
    const hasText = Boolean(text && text.trim())

    if (!hasText) {
        msg.className = 'status hidden'
        msg.textContent = ''
        return
    }

    msg.className = `status ${type}`
    msg.textContent = text
}

const createOrder = async (amount) => {
    try {

        const payload = { amount: amount }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }

        const response = await fetch('/razorpay-payment/create-order', options)
        if (!response.ok) throw new Error('Failed to create order')

        const result = await response.json()

        return result

    } catch (error) {
        console.error('Error creating order:', error)
    }
}

const getKey = async () => {
    const response = await fetch('/razorpay-payment/get-key')
    const data = await response.json()
    return data.key
}


const verifyPayment = async (paymentData) => {
    const response = await fetch('/razorpay-payment/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    });

    const data = await response.json()

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Payment verification failed')
    }

    return data
}

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const amount = Number(amountInput.value)
    if (!amount || amount < 1) {
        setMessage('error', 'Please enter a valid amount')
        return
    }
    try {
        payButton.disabled = true
        setMessage('pending', 'Creating your order...')

        const [key, order] = await Promise.all([getKey(), createOrder(amount)])

        if (!key) {
            throw new Error('Missing Razorpay key from backend')
        }

        const options = {
            key,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            name: 'Naughty Gaziabad',
            description: 'Test Transaction',
            handler: async function (response) {
                try {


                    await verifyPayment(response)
                    setMessage('success', `Payment verified successfully! Payment ID: ${response.razorpay_payment_id}`)

                }
                catch (err) {
                    console.error('Error verifying payment:', err)
                    setMessage('error', 'Payment verification failed.')
                }

            },

            prefill: {
                name: 'Test User',
                email: 'test@example.com',
                contact: '9999999999'
            },
            theme: {
                color: '#eb5d2a'
            },
            modal: {
                ondismiss: function () {
                    setMessage('error', 'Payment popup closed. Please try again.')
                }
            }

        }

        const razorpay = new window.Razorpay(options)
        razorpay.on('payment.failed', function (response) {
            setMessage('error', `${response.error.description || 'Payment failed.'}`)
        });

        razorpay.open();

    }
    catch (err) {
        setMessage('error', `${err.message || 'Something went wrong'}`)
    }
    finally {
        payButton.disabled = false
    }
})  