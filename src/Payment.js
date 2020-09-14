import React,{useState,useEffect} from 'react';
import { Link,useHistory } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';
import CheckoutProduct from './CheckoutProduct'
import {useStateValue} from './StateProvider';
import {db} from './firebase';
import {getBasketTotal} from './reducer';
import './Payment.css'
import { useElements,useStripe,CardElement } from '@stripe/react-stripe-js';
import axios from './axios';
function Payment() {
    const history = useHistory();
    const [{basket,user} , dispatch] = useStateValue();
    const stripe = useStripe();
    const elements = useElements();
    const [succeeded,setSucceeded] = useState(false);
    const [processing,setProcessing] = useState("");
    const [clientSecret,setClientSecret] = useState(true);
    const[error,setError] = useState(null);
    const [disabled,setDisabled] = useState(true);
    
    useEffect(() => {
        //generate a special stripe secret which allows us to charge to our customer
        const getClientSecret = async () =>{
            const response = await axios({
                method:'post',
                //stripe expects the totals in a currencies subunit
                url:`payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    }, [basket])
    console.log(`client secret ${clientSecret}`)

    const handleSubmit = async (event)=>{
        event.preventDefault();
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
                card:elements.getElement(CardElement)
            }
        }).then(({paymentIntent})=>{
            db.collection('users').doc(user?.uid).collection('orders').doc(paymentIntent.id).set({
              basket:basket,
              amount:paymentIntent.amount,
              created:paymentIntent.created
            })

            setSucceeded(true)
            setError(null)
            setProcessing(false)
            dispatch({
              type:'EMPTY_BASKET'
            })
            history.replace('./orders')
        })
    }

    const handleChange = event =>{
        setDisabled(event.empty);
        setError(event.error?event.error.message:"");
    }
    return (
      <div className="payment">
        <div className="payment__container">
          <h1>
            Checkout (<Link to="/checkout">{basket.length} items)</Link>
          </h1>
          <div className="payment__section">
            <div className="payment__title">
              <h3>Delivery Address</h3>
            </div>
            <div className="payment__address">
              <p>{user?.email}</p>
              <p>123 React lane</p>
              <p>los angelos ,CA</p>
            </div>
          </div>
          <div className="payment__section">
            <div className="paymen__title">
              <h3>Review items and delivery</h3>
            </div>
            <div className="payment__items">
              {basket.map((item) => (
                <CheckoutProduct
                  id={item.id}
                  title={item.title}
                  rating={item.rating}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </div>
          <div className="payment__section">
            <div className="payment__title">
              <h3>Payment Method</h3>
            </div>
            <div className="payment__details">
              <form onSubmit={handleSubmit}>
                <CardElement onChange={handleChange} />
                <div classNam="payment__priceContainer">
                  <CurrencyFormat
                    renderText={(value) => <h3>Order Total: {value}</h3>}
                    decimalScale={2}
                    value={getBasketTotal(basket)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                  />
                  <button disabled={processing || disabled || succeeded} >
                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                  </button>
                </div>
              {error && <div>{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Payment
