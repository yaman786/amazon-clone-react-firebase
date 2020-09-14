import React from 'react'
import  CheckoutProduct  from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";
import moment from 'moment'
import './Order.css'
function Order({order}) {
    return (
      <div className="order">
        <h1>Order</h1>
        <p>{moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")}</p>
        <p className="order__id">
          <small>{order.id}</small>
        </p>
        {order.data.basket?.map((item) => (
          <CheckoutProduct
            id={item.id}
            image={item.image}
            title={item.title}
            rating={item.rating}
            price={item.price}
            hideButton
          />
        ))}
        <CurrencyFormat
          renderText={(value) => (
          <h3 className="order__total">Order Total :{value}</h3>
          )}
          decimalScale={2}
          value={order.data.amount / 100}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />
      </div>
    );
}

export default Order
