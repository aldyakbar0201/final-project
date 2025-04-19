'use client';

import { createContext, useState, useEffect } from 'react';

interface ReducerContextType {
  itemQuantity: number;
  setItemQuantity: (quantity: number) => void;
  reducer: number;
}

export const ReducerContext = createContext<ReducerContextType | undefined>(
  undefined,
);

export const ReducerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [itemQuantity, setItemQuantity] = useState(1);
  const [reducer, setReducer] = useState(0);

  useEffect(() => {
    async function quantityReducer() {
      const response = await fetch(
        'http://localhost:8000/api/v1/carts/cart-quantity',
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            userId: null,
          }),
        },
      );
      const data = await response.json();
      setReducer(data.totalQuantity);
    }

    quantityReducer();
  }, []);

  return (
    <ReducerContext.Provider
      value={{
        itemQuantity,
        setItemQuantity,
        reducer,
      }}
    >
      {children}
    </ReducerContext.Provider>
  );
};
