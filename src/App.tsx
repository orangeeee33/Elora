import { useState } from "react";

import Collection from "./components/Collection";
import Cart from "./components/Cart";

import type { Product } from "./data/products";
import Contact from "./components/contact";

import "./styles/reset.css";
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/Contact.css";
import "./styles/cart.css";
import "./styles/collection.css";
import "./styles/checkout.css";


type CartItem = Product & {
  quantity: number;
};


function App() {

  /* ==========================================
     CART STATE
  ========================================== */

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] =
    useState(false);


  /* ==========================================
     NAVBAR + COLLECTION STATE
  ========================================== */

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

 
  const [showFavorites, setShowFavorites] =
    useState(false);

  const [activeCategory, setActiveCategory] =
    useState("ALL");


  /* ==========================================
     ADD TO CART
  ========================================== */
const addToCart = (product: Product) => {

  const finalPrice =
    product.isSale &&
    product.newPrice !== undefined
      ? product.newPrice
      : product.price;


  setCart((currentCart) => {

    const existingItem =
      currentCart.find(
        (item) =>
          item.id === product.id
      );


    if (existingItem) {

      return currentCart.map(
        (item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
      );

    }


    return [
      ...currentCart,
      {
        ...product,

        price: finalPrice,

        quantity: 1,
      },
    ];

  });

};


  /* ==========================================
     INCREASE QUANTITY
  ========================================== */

  const increaseQuantity = (id: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };


  /* ==========================================
     DECREASE QUANTITY
  ========================================== */

  const decreaseQuantity = (id: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };


  /* ==========================================
     REMOVE FROM CART
  ========================================== */

  const removeFromCart = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  };


  /* ==========================================
     CART COUNT + TOTAL
  ========================================== */

  const cartCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );


  /* ==========================================
     SCROLL TO COLLECTION
  ========================================== */

  const scrollToCollection = () => {
    document
      .getElementById("collection")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };


  /* ==========================================
     OPEN CATEGORY
  ========================================== */

  const openCategory = (
    category: string
  ) => {
    setActiveCategory(category);

    setIsMenuOpen(false);
  
    setShowFavorites(false);

    scrollToCollection();
  };


  /* ==========================================
     OPEN SEARCH
  ========================================== */

  const openSearch = () => {
    setActiveCategory("ALL");


    setShowFavorites(false);
    setIsMenuOpen(false);

    scrollToCollection();
  };


  /* ==========================================
     OPEN FAVORITES
  ========================================== */

  const openFavorites = () => {
    setActiveCategory("ALL");

    setShowFavorites(true);

    setIsMenuOpen(false);

    scrollToCollection();
  };


  return (

    <main>

      {/* ======================================
          HERO
      ====================================== */}

      <section
        id="home"
        className="hero"
      >

       <video
          className="hero-video"
          src={`${import.meta.env.BASE_URL}videos/fashion-hero.mp4`}
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="hero-overlay" />


        {/* ==================================
            NAVBAR
        ================================== */}

        <nav className="navbar">

          {/* HAMBURGER */}

          <button
            type="button"
            className="nav-menu-btn"
            aria-label="Open menu"
            onClick={() =>
              setIsMenuOpen(true)
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </button>


          {/* LOGO */}

          <a
            href="#home"
            className="logo"
          >
            ELORA
          </a>


          {/* RIGHT ICONS */}

          <div className="nav-actions">

            {/* SEARCH */}

            <button
              type="button"
              className="nav-icon"
              aria-label="Search"
              onClick={openSearch}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <line
                  x1="16.5"
                  y1="16.5"
                  x2="21"
                  y2="21"
                />
              </svg>
            </button>


            {/* FAVORITES */}

            <button
              type="button"
              className="nav-icon"
              aria-label="Favorites"
              onClick={openFavorites}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="
                    M20.8 4.6
                    a5.5 5.5 0 0 0-7.8 0
                    L12 5.7
                    l-1.1-1.1
                    a5.5 5.5 0 0 0-7.8 7.8
                    L12 21
                    l8.8-8.6
                    a5.5 5.5 0 0 0 0-7.8z
                  "
                />
              </svg>
            </button>


            {/* CART */}

            <button
              type="button"
              className="nav-icon cart-nav-icon"
              aria-label="Cart"
              onClick={() =>
                setIsCartOpen(true)
              }
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M6 7h12l-1 14H7L6 7z"
                />

                <path
                  d="M9 7V5a3 3 0 0 1 6 0v2"
                />
              </svg>

              {cartCount > 0 && (
                <span className="nav-cart-count">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </nav>


        {/* ==================================
            SIDE MENU
        ================================== */}

        {isMenuOpen && (

          <>

            <div
              className="menu-overlay"
              onClick={() =>
                setIsMenuOpen(false)
              }
            />

            <aside className="side-menu">

              <div className="side-menu-header">

                <span className="side-menu-logo">
                  ELORA
                </span>

                <button
                  type="button"
                  className="side-menu-close"
                  aria-label="Close menu"
                  onClick={() =>
                    setIsMenuOpen(false)
                  }
                >
                  ×
                </button>

              </div>


              <nav className="side-menu-links">

                <a
                  href="#collection"
                  onClick={(event) => {
                    event.preventDefault();
                    openCategory("ALL");
                  }}
                >
                  SHOP ALL
                </a>

                <a
                  href="#collection"
                  onClick={(event) => {
                    event.preventDefault();
                    openCategory("NEW ARRIVALS");
                  }}
                >
                  NEW ARRIVALS
                </a>
                <a
                  href="#collection"
                  onClick={(event) => {
                    event.preventDefault();
                    openCategory("SALE");
                  }}
                >
                  SALE
                </a>
                <a
                  href="#contact"
                  onClick={() =>
                    setIsMenuOpen(false)
                  }
                >
                  CONTACT
                </a>
                
      

              </nav>

            </aside>

          </>

        )}


        {/* ==================================
            HERO CONTENT
        ================================== */}

        <div className="hero-content">

          <p className="hero-label">
            NEW COLLECTION
          </p>

          <h1>
            WEAR YOUR
            <span>GLOW</span>
          </h1>

          <p className="hero-description">
            Because the right look makes you shine.
          </p>


          <div className="hero-buttons">

            <a
              href="#collection"
              className="collection-button"
              onClick={(event) => {
                event.preventDefault();
                openCategory("ALL");
              }}
            >
              SHOP COLLECTION
            </a>

            <a
              href="#collection"
              className="style-button"
              onClick={(event) => {
                event.preventDefault();
                openCategory("NEW ARRIVALS");
              }}
            >
              NEW COLLECTION
            </a>

          </div>

        </div>


        <a
          href="#collection"
          className="scroll-message"
          onClick={(event) => {
            event.preventDefault();
            openCategory("ALL");
          }}
        >
          SCROLL TO DISCOVER ↓
        </a>

      </section>


      {/* ======================================
          COLLECTION
      ====================================== */}

      <section
        id="collection"
        className="collection"
      >

        <Collection
          onAddToCart={addToCart}

          activeCategory={activeCategory}

          onCategoryChange={
            setActiveCategory
          }

         
          showFavorites={showFavorites}

          onOpenFavorites={() =>
            setShowFavorites(true)
          }

          onCloseFavorites={() =>
            setShowFavorites(false)
          }
        />

      </section>

      {/* ======================================
          CONTACT
      ====================================== */}
      <Contact />

      {/* ======================================
          CART
      ====================================== */}

      <Cart
        cart={cart}

        cartCount={cartCount}

        cartTotal={cartTotal}

        isOpen={isCartOpen}

        onClose={() =>
          setIsCartOpen(false)
        }

        increaseQuantity={
          increaseQuantity
        }

        decreaseQuantity={
          decreaseQuantity
        }

        removeFromCart={
          removeFromCart
        }
      />

    </main>
  );
}


export default App;