import { useState } from "react";
import type { Product } from "../data/products";
import Checkout from "./Checkout";


type CartItem = Product & {
  quantity: number;
};


type CartProps = {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isOpen: boolean;
  onClose: () => void;

  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
};


function Cart({
  cart,
  cartCount,
  cartTotal,
  isOpen,
  onClose,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}: CartProps) {

  const [showCheckout, setShowCheckout] = useState(false);


  return (
    <>

      {/* =====================================
          OVERLAY
      ====================================== */}

      {isOpen && (
        <div
          className="cart-overlay"
          onClick={onClose}
        />
      )}


      {/* =====================================
          CART PANEL
      ====================================== */}

      <aside
        className={`cart-panel ${
          isOpen ? "open" : ""
        }`}
      >

        {/* HEADER */}

        <div className="cart-header">

          <div>
            <p className="cart-small">
              ELORA
            </p>

            <h2>
              YOUR BAG
            </h2>
          </div>


          <button
            type="button"
            className="close-cart"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* =====================================
            ITEMS
        ====================================== */}

        <div className="cart-items">

          {cart.length === 0 ? (

            <div className="empty-cart">

              <p>
                Your bag is empty.
              </p>

              <button
                type="button"
                onClick={onClose}
              >
                CONTINUE SHOPPING
              </button>

            </div>

          ) : (

            cart.map((item) => (

              <div
                className="cart-item"
                key={item.id}
              >

                {/* IMAGE */}

                <img
                  className="cart-item-image"
                  src={`${import.meta.env.BASE_URL}${item.image.replace(/^\//, "")}`}
                  alt={item.name}
                />


                {/* INFO */}

                <div className="cart-item-info">

                  <h3>
                    {item.name}
                  </h3>

                  <p className="cart-item-price">
                    ${item.price.toFixed(2)}
                  </p>


                  {/* QUANTITY */}

                  <div className="quantity-controls">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      −
                    </button>


                    <span>
                      {item.quantity}
                    </span>


                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                </div>


                {/* REMOVE */}

                <button
                  type="button"
                  className="remove-item"
                  onClick={() =>
                    removeFromCart(
                      item.id
                    )
                  }
                  aria-label="Remove item"
                >
                  ×
                </button>

              </div>

            ))

          )}

        </div>


        {/* =====================================
            FOOTER
        ====================================== */}

        {cart.length > 0 && (

          <div className="cart-footer">

            <div className="cart-summary">

              <span>
                Items
              </span>

              <span>
                {cartCount}
              </span>

            </div>


            <div className="cart-total">

              <span>
                TOTAL
              </span>

              <strong>
                ${cartTotal.toFixed(2)}
              </strong>

            </div>


            <button
              type="button"
              className="checkout-button"
              onClick={() => {
                onClose();
                setShowCheckout(true);
              }}
            >
              CHECKOUT
            </button>

          </div>

        )}

      </aside>


      {showCheckout && (
        <Checkout
          cart={cart}
          cartTotal={cartTotal}
          onClose={() =>
            setShowCheckout(false)
          }
        />
      )}

    </>
  );
}


export default Cart;