import {
  useState,
  type FormEvent,
} from "react";

import type {
  Product,
} from "../data/products";


type CartItem = Product & {
  quantity: number;
};


type CheckoutProps = {
  cart: CartItem[];
  cartTotal: number;
  onClose: () => void;
};


function Checkout({
  cart,
  cartTotal,
  onClose,
}: CheckoutProps) {

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<"cash" | "wish">("cash");

  const [
    transactionNumber,
    setTransactionNumber,
  ] = useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [orderSent, setOrderSent] =
    useState(false);


  /* ==========================================
     SUBMIT ORDER
  ========================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setErrorMessage("");


    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      setErrorMessage(
        "Please complete all required information."
      );

      return;
    }


    if (
      paymentMethod === "wish" &&
      !transactionNumber.trim()
    ) {
      setErrorMessage(
        "Please enter the Wish transaction number."
      );

      return;
    }


    if (cart.length === 0) {
      setErrorMessage(
        "Your bag is empty."
      );

      return;
    }


    const orderData = {

      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      },

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,

        itemTotal:
          item.price * item.quantity,
      })),

      total: cartTotal,

      paymentMethod,

      transactionNumber:
        paymentMethod === "wish"
          ? transactionNumber.trim()
          : "",

      createdAt:
        new Date().toISOString(),
    };


    try {

      setIsSubmitting(true);

      console.log(
        "Order ready for backend:",
        orderData
      );


    

      setOrderSent(true);

    } catch (error) {

      console.error(error);

      setErrorMessage(
        "Something went wrong. Please try again."
      );

    } finally {

      setIsSubmitting(false);

    }

  };


  /* ==========================================
     SUCCESS
  ========================================== */

  if (orderSent) {

    return (

      <div
        className="checkout-overlay"
        role="dialog"
        aria-modal="true"
      >

        <div className="checkout-success">

          <span className="success-icon">
            ✓
          </span>

          <p className="checkout-small">
            ELORA
          </p>

          <h2>
            ORDER RECEIVED
          </h2>

          <p>
            Thank you, {name}.
            Your order has been received.
          </p>

          <button
            type="button"
            onClick={onClose}
          >
            CONTINUE SHOPPING
          </button>

        </div>

      </div>

    );

  }


  return (

    <div
      className="checkout-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
      onClick={onClose}
    >

      <div
        className="checkout-panel"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ==================================
            HEADER
        ================================== */}

        <div className="checkout-header">

          <div>

            <p className="checkout-small">
              ELORA
            </p>

            <h2>
              CHECKOUT
            </h2>

          </div>

          <button
            type="button"
            className="checkout-close"
            aria-label="Close checkout"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <div className="checkout-content">

          {/* ==================================
              FORM
          ================================== */}

          <form
            className="checkout-form"
            onSubmit={handleSubmit}
          >

            <div className="checkout-field">

              <label htmlFor="checkout-name">
                FULL NAME
              </label>

              <input
                id="checkout-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                autoComplete="name"
                required
              />

            </div>


            <div className="checkout-field">

              <label htmlFor="checkout-phone">
                PHONE NUMBER
              </label>

              <input
                id="checkout-phone"
                type="tel"
                placeholder="+961..."
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                autoComplete="tel"
                required
              />

            </div>


            <div className="checkout-field">

              <label htmlFor="checkout-address">
                DELIVERY ADDRESS
              </label>

              <textarea
                id="checkout-address"
                placeholder="City, street, building..."
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                autoComplete="street-address"
                required
              />

            </div>


            {/* ==================================
                PAYMENT
            ================================== */}

            <div className="payment-section">

              <p className="payment-title">
                PAYMENT METHOD
              </p>


              <label
                className={`payment-option ${
                  paymentMethod === "cash"
                    ? "active"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={
                    paymentMethod === "cash"
                  }
                  onChange={() => {
                    setPaymentMethod("cash");
                    setTransactionNumber("");
                    setErrorMessage("");
                  }}
                />

                <div>

                  <strong>
                    CASH ON DELIVERY
                  </strong>

                  <span>
                    Pay when your order arrives.
                  </span>

                </div>

              </label>


              <label
                className={`payment-option ${
                  paymentMethod === "wish"
                    ? "active"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="wish"
                  checked={
                    paymentMethod === "wish"
                  }
                  onChange={() => {
                    setPaymentMethod("wish");
                    setErrorMessage("");
                  }}
                />

                <div>

                  <strong>
                    WISH MONEY
                  </strong>

                  <span>
                    Pay by Wish transfer.
                  </span>

                </div>

              </label>


              {paymentMethod === "wish" && (

                <div className="checkout-field transaction-field">

                  <label htmlFor="transaction-number">
                    TRANSACTION NUMBER
                  </label>

                  <input
                    id="transaction-number"
                    type="text"
                    placeholder="Enter transaction number"
                    value={transactionNumber}
                    onChange={(event) =>
                      setTransactionNumber(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              )}

            </div>


            {/* ERROR MESSAGE */}

            {errorMessage && (

              <p
                className="checkout-error"
                role="alert"
              >
                {errorMessage}
              </p>

            )}


            <button
              type="submit"
              className="place-order-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "SENDING ORDER..."
                : `PLACE ORDER — $${cartTotal.toFixed(2)}`}
            </button>

          </form>


          {/* ==================================
              ORDER SUMMARY
          ================================== */}

          <div className="checkout-summary">

            <p className="checkout-summary-title">
              YOUR ORDER
            </p>


            {cart.map((item) => (

              <div
                className="checkout-item"
                key={item.id}
              >

                <img
                  src={`${import.meta.env.BASE_URL}${item.image.replace(/^\//, "")}`}
                  alt={item.name}
                />

                <div>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Qty: {item.quantity}
                  </p>

                </div>

                <strong>
                  $
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(2)}
                </strong>

              </div>

            ))}


            <div className="checkout-total">

              <span>
                TOTAL
              </span>

              <strong>
                ${cartTotal.toFixed(2)}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}


export default Checkout;