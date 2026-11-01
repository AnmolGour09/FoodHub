
import API from "./api";

export const addToCart = async (menuItemId, quantity = 1) => {
  const response = await API.post("/cart", {
    menuItemId,
    quantity,
  });

  return response.data;
};


export const getCart = async () => {
  const response = await API.get("/cart");
  return response.data.data;
};
<<<<<<< HEAD
=======
  
>>>>>>> a2a06eb (Fix Vercel cart page routing)

export const updateCartItem = async (itemId, quantity) => {
  const response = await API.patch(`/cart/${itemId}`, {
    quantity,
  });

  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await API.delete(`/cart/${itemId}`);
  return response.data;
};
