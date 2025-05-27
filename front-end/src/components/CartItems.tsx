import {
  type CartItem,
  addToCart,
  removeFromCart,
} from "../store/cart-slice.ts";
import { useCartDispatch, useCartSelector } from "../store/hooks.ts";
import { calculateDiscountPrice } from "./Product.tsx";

export default function CartItems() {
  const cartItems = useCartSelector((state) => state.cart.items);
  const dispatch = useCartDispatch();

  const totalPrice = cartItems.reduce((val, item) => {
    let discountPrice = calculateDiscountPrice(
      item.price,
      item.discountpercentage
    );

    return val + discountPrice * item.quantity;
  }, 0);

  function handleAddToCart(item: CartItem) {
    dispatch(addToCart(item));
  }

  function handleRemoveFromCart(id: number) {
    dispatch(removeFromCart(id));
  }

  return (
    <div id="cart">
      {cartItems.length === 0 && <p>No items in cart!</p>}

      {cartItems.length > 0 && (
        <ul id="cart-items">
          {cartItems.map((item) => {
            const formattedPrice = `$${calculateDiscountPrice(
              item.price,
              item.discountpercentage
            )}`;

            return (
              <li key={item.id}>
                <div>
                  <span>{item.title}</span>
                  <span>({item.size})</span>
                  <span> ({formattedPrice})</span>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => handleRemoveFromCart(item.id)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleAddToCart(item)}>+</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p id="cart-total-price">
        Cart Total: <strong>${totalPrice}</strong>
      </p>
    </div>
  );
}
