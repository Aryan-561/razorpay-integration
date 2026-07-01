import Router from 'express';
import { razorpay } from '../utils/razorpay.js';
import crypto from 'crypto'

const router = Router();

router.post('/create-order', async (req, res) => {

    try {
        const { amount } = req.body

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt${Date.now()}`
        }

        const order = await razorpay.orders.create(options)

        return res.json(order)
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Failed to create order' })
    }


})


router.get('/get-key', (req, res) => {

    return res.json({key: process.env.RAZORPAY_KEY_ID})

})

router.post('/verify-payment', async (req, res)=>{
    try{

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing payment details' })
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex')


        if(expectedSignature !== razorpay_signature){
            return res.status(400).json({success:false, message:'Invalid signature'})
        }

        return res.status(200).json({success:true, message:'Payment verified successfully'})



    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
})

export default router;