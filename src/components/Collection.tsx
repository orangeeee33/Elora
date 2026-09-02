import {
  useEffect,
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";

import {
  MotionPathPlugin,
} from "gsap/MotionPathPlugin";

import {
  products,
} from "../data/products";

import type {
  Product,
} from "../data/products";


gsap.registerPlugin(
  MotionPathPlugin
);


const categories = [
  "ALL",
  "NEW ARRIVALS",
  "SALE",
  "DRESSES",
  "TOPS",
  "BOTTOMS",
  "SETS",
  "SHOES",
  "BAGS",
];


type CollectionProps = {
  onAddToCart: (product: Product) => void;

  activeCategory: string;
  onCategoryChange: (category: string) => void;

  isSearchOpen: boolean;
  onCloseSearch: () => void;

  showFavorites: boolean;
  onOpenFavorites: () => void;
  onCloseFavorites: () => void;
};


function Collection({
  onAddToCart,

  activeCategory,
  onCategoryChange,

  isSearchOpen,
  onCloseSearch,

  showFavorites,
  onOpenFavorites,
  onCloseFavorites,
}: CollectionProps) {

  const sectionRef =
    useRef<HTMLElement>(null);

  const collectionHeaderRef =
    useRef<HTMLDivElement>(null);

  const butterflyRef =
    useRef<SVGSVGElement>(null);

  const animationPlayedRef =
    useRef(false);


  const [search, setSearch] =
    useState("");

  const [favorites, setFavorites] =
    useState<number[]>([]);

  const [addedProducts, setAddedProducts] =
    useState<number[]>([]);


  /* ==========================================
     GSAP BUTTERFLY ANIMATION
  ========================================== */

  useEffect(() => {

    const section =
      sectionRef.current;

    const collectionHeader =
      collectionHeaderRef.current;

    const butterfly =
      butterflyRef.current;


    if (
      !section ||
      !collectionHeader ||
      !butterfly
    ) {
      return;
    }


    gsap.set(butterfly, {
      opacity: 0,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "50% 50%",
    });


    const playButterflyAnimation = () => {

      if (animationPlayedRef.current) {
        return;
      }


      animationPlayedRef.current = true;


      const sectionWidth =
        section.offsetWidth;

      const isMobile =
        window.innerWidth <= 650;


      const finalX =
        isMobile
          ? sectionWidth / 2 + 112
          : sectionWidth / 2 + 285;


      const finalY =
        isMobile
          ? 205
          : 195;


      const flightPath = isMobile
        ? `
          M -70 20

          C 15 45,
            5 145,
            90 160

          C 165 172,
            145 70,
            245 75

          C 330 78,
            350 145,
            300 170

          C 260 190,
            280 225,
            ${finalX} ${finalY}
        `
        : `
          M -100 20

          C 45 55,
            35 180,
            190 175

          C 350 170,
            410 55,
            610 75

          C 790 95,
            890 25,
            980 115

          C 1040 180,
            950 245,
            860 190

          C 790 150,
            820 105,
            900 125

          C 950 145,
            940 210,
            ${finalX} ${finalY}
        `;


      const timeline =
        gsap.timeline();


      timeline
        .to(
          butterfly,
          {
            opacity: 1,
            duration: 0.35,
            ease: "power1.out",
          },
          0
        )

        .to(
          butterfly,
          {
            duration: isMobile
              ? 4.5
              : 5.4,

            ease: "power1.inOut",

            motionPath: {
              path: flightPath,

              autoRotate: 90,

              alignOrigin: [
                0.5,
                0.5,
              ],
            },
          },
          0
        )

        .to(
          butterfly,
          {
            rotation: 8,
            scale: isMobile
              ? 0.72
              : 0.78,

            duration: 0.55,

            ease: "power2.out",
          }
        )

        .to(
          butterfly,
          {
            y: "+=6",
            rotation: 11,

            duration: 1.4,

            ease: "sine.inOut",

            repeat: -1,
            yoyo: true,
          }
        );

    };


    const observer =
      new IntersectionObserver(
        ([entry]) => {

          if (entry.isIntersecting) {

            playButterflyAnimation();

            observer.disconnect();

          }

        },
        {
          threshold: 0.55,
        }
      );


    observer.observe(collectionHeader);


    return () => {

      observer.disconnect();

      gsap.killTweensOf(
        butterfly
      );

    };

  }, []);


  /* ==========================================
     FAVORITES
  ========================================== */

  const toggleFavorite = (
    id: number
  ) => {

    setFavorites(
      (currentFavorites) =>
        currentFavorites.includes(id)
          ? currentFavorites.filter(
              (itemId) =>
                itemId !== id
            )
          : [
              ...currentFavorites,
              id,
            ]
    );

  };


  /* ==========================================
     FAVORITES VIEW
  ========================================== */

  const handleFavoritesView = () => {

    if (showFavorites) {

      onCloseFavorites();

      return;

    }


    onCategoryChange("ALL");

    setSearch("");

    onCloseSearch();

    onOpenFavorites();

  };


  /* ==========================================
     ADD TO CART
  ========================================== */

  const handleAddToCart = (
    product: Product
  ) => {

    onAddToCart(product);


    setAddedProducts(
      (currentProducts) =>
        currentProducts.includes(
          product.id
        )
          ? currentProducts
          : [
              ...currentProducts,
              product.id,
            ]
    );

  };


  /* ==========================================
     CHANGE CATEGORY
  ========================================== */

  const handleCategoryChange = (
    category: string
  ) => {

    onCategoryChange(category);

    onCloseFavorites();

    setSearch("");

  };


  /* ==========================================
     FILTER PRODUCTS
  ========================================== */

  const filteredProducts =
    products.filter((product) => {

      const categoryMatch =
        activeCategory === "ALL" ||

        (
          activeCategory ===
            "NEW ARRIVALS" &&
          product.isNew
        ) ||

        (
          activeCategory ===
            "SALE" &&
          product.isSale
        ) ||

        product.category ===
          activeCategory;


      const searchMatch =
        product.name
          .toLowerCase()
          .includes(
            search
              .trim()
              .toLowerCase()
          );


      const favoriteMatch =
        !showFavorites ||
        favorites.includes(
          product.id
        );


      return (
        categoryMatch &&
        searchMatch &&
        favoriteMatch
      );

    });


  return (

    <section
      ref={sectionRef}
      id="shop"
      className="collection-section"
    >

      {/* ======================================
          GOLDEN BUTTERFLY
      ====================================== */}

      <div
        className="collection-butterfly-animation"
        aria-hidden="true"
      >

        <svg
          ref={butterflyRef}
          className="collection-butterfly"
          viewBox="0 0 120 90"
          xmlns="http://www.w3.org/2000/svg"
        >

          <defs>

            <linearGradient
              id="butterflyGold"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >

              <stop
                offset="0%"
                stopColor="#fff2ae"
              />

              <stop
                offset="45%"
                stopColor="#d7b550"
              />

              <stop
                offset="100%"
                stopColor="#9d7925"
              />

            </linearGradient>

          </defs>


          <g className="butterfly-left-wing">

            <path
              d="
                M57 45
                C39 10 8 7 12 30
                C14 43 32 48 51 49
                C29 50 17 61 22 75
                C29 89 50 66 57 49
                Z
              "
              fill="url(#butterflyGold)"
              fillOpacity="0.88"
              stroke="#f8e7a1"
              strokeWidth="1.2"
            />

            <path
              d="
                M49 43
                C36 26 24 22 18 27
                M49 51
                C36 57 29 66 28 73
              "
              fill="none"
              stroke="#fff1b5"
              strokeWidth="1"
              strokeOpacity="0.7"
            />

          </g>


          <g className="butterfly-right-wing">

            <path
              d="
                M63 45
                C81 10 112 7 108 30
                C106 43 88 48 69 49
                C91 50 103 61 98 75
                C91 89 70 66 63 49
                Z
              "
              fill="url(#butterflyGold)"
              fillOpacity="0.88"
              stroke="#f8e7a1"
              strokeWidth="1.2"
            />

            <path
              d="
                M71 43
                C84 26 96 22 102 27
                M71 51
                C84 57 91 66 92 73
              "
              fill="none"
              stroke="#fff1b5"
              strokeWidth="1"
              strokeOpacity="0.7"
            />

          </g>


          <ellipse
            cx="60"
            cy="48"
            rx="3.7"
            ry="21"
            fill="#a98026"
          />


          <circle
            cx="60"
            cy="25"
            r="4.5"
            fill="#d7b550"
          />


          <path
            d="
              M58 23
              C51 13 46 14 44 9

              M62 23
              C69 13 74 14 76 9
            "
            fill="none"
            stroke="#f5db78"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

        </svg>

      </div>


      {/* ======================================
          HEADER
      ====================================== */}

      <div
        ref={collectionHeaderRef}
        className="collection-header"
      >

        <p className="collection-small">
          FIND YOUR LOOK
        </p>

        <h2>
          OUR
          <span> COLLECTION</span>
        </h2>

        <p className="collection-description">
          Find the pieces that make you shine.
        </p>

      </div>


      {/* ======================================
          SEARCH
      ====================================== */}

      {isSearchOpen && (

        <div className="collection-search-container">

          <div className="collection-search">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search dresses, tops, bags..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              autoFocus
            />

            <button
              type="button"
              className="close-search"
              aria-label="Close search"
              onClick={() => {

                setSearch("");

                onCloseSearch();

              }}
            >
              ×
            </button>

          </div>

        </div>

      )}


      {/* ======================================
          CATEGORIES
      ====================================== */}

      <div className="collection-categories">

        {categories.map(
          (category) => (

            <button
              type="button"
              key={category}
              className={
                activeCategory ===
                  category &&
                !showFavorites
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleCategoryChange(
                  category
                )
              }
            >
              {category}
            </button>

          )
        )}


        <button
          type="button"
          className={
            showFavorites
              ? "favorites-category active"
              : "favorites-category"
          }
          onClick={
            handleFavoritesView
          }
        >
          {showFavorites
            ? "SHOW ALL ×"
            : "♡ MY FAVORITES"}
        </button>

      </div>


      {/* ======================================
          PRODUCTS
      ====================================== */}

      <div className="products-grid">

        {filteredProducts.length === 0 ? (

          <div className="no-products">

            <p>

              {showFavorites
                ? "No favorites yet. Add some to get started!"
                : search
                  ? `No products found for "${search}"`
                  : "No products in this category"}

            </p>

          </div>

        ) : (

          filteredProducts.map(
            (product) => (

              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  {product.isNew && (

                    <span className="new-badge">
                      NEW
                    </span>

                  )}


                  {product.isSale && (

                    <span className="sale-badge">
                      SALE
                    </span>

                  )}


                  <img
                    src={`${import.meta.env.BASE_URL}${product.image.replace(/^\//, "")}`}
                    alt={product.name}
                  />


                  <button
                    type="button"
                    className={`product-favorite ${
                      favorites.includes(
                        product.id
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleFavorite(
                        product.id
                      )
                    }
                    aria-label={
                      favorites.includes(
                        product.id
                      )
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favorites.includes(
                      product.id
                    )
                      ? "♥️"
                      : "♡"}
                  </button>

                </div>


                <div className="product-info">

                  <h3>
                    {product.name}
                  </h3>


                  <div className="product-price">

                    {product.isSale &&
                    product.newPrice !==
                      undefined ? (

                      <>

                        <span className="old-price">
                          $
                          {product.price.toFixed(
                            2
                          )}
                        </span>

                        <span className="sale-price">
                          $
                          {product.newPrice.toFixed(
                            2
                          )}
                        </span>

                      </>

                    ) : (

                      <span className="current-price">
                        $
                        {product.price.toFixed(
                          2
                        )}
                      </span>

                    )}

                  </div>

                </div>


                <div className="product-actions">

                  <button
                    type="button"
                    className="add-cart-button"
                    onClick={() =>
                      handleAddToCart(
                        product
                      )
                    }
                  >
                    {addedProducts.includes(
                      product.id
                    )
                      ? "ADDED ✓"
                      : "ADD TO CART"}
                  </button>

                </div>

              </article>

            )
          )

        )}

      </div>

    </section>

  );

}


export default Collection;