const functions = require('firebase-functions');

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")('sk_test_51HQ8NcEMmZ6EFdBjtyI6zlVsyfuhz97ceD9qOvQBImfc1gXyyZQwRwhmXfATJnVPgwIMvEbbZ78gi0Sn3R5jADiI00i61CPT2O');


//API



//App config
const app = express();

//Middlewares
app.use(cors({origin:true}));
app.use(express.json());
//API routes
app.get('/',(request,response)=>response.status(200).send('hello world'));
app.post('/payments/create', async (request,response)=>{
    const total = request.query.total;
    console.log(total);
    const paymentIntent = await stripe.paymentIntents.create({
        amount:total,//subunits of currency (cents)
        currency:"usd"
    });
    //ok created
    response.status(201).send({
        clientSecret:paymentIntent.client_secret,
    });
});
// Listen

exports.api = functions.https.onRequest(app);