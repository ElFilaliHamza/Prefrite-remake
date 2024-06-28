// PanierContext.js
import React, { createContext, useReducer, useContext } from 'react';

const PanierContext = createContext();

const initialState = {
  clientId: null,
  arts: [],
  payment: 0,
};

const panierReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_PANIER':
      const existingArt = state.arts.find((a) => a._id === action.payload._id);
      let updatedArts;
      if (existingArt) {
        updatedArts = state.arts.map((a) =>
          a._id === action.payload._id ? { ...a, qt: a.qt + action.payload.qt } : a
        );
      } else {
        updatedArts = [...state.arts, action.payload];
      }
      return { ...state, arts: updatedArts };
    case 'REMOVE_FROM_PANIER':
      return {
        ...state,
        arts: state.arts.filter((a) => a._id !== action.payload),
      };
    case 'CLEAR_PANIER':
      return initialState;
    case 'SET_CLIENT':
      return { ...state, clientId: action.payload };
    case 'UPDATE_PAYMENT':
      return { ...state, payment: action.payload };
    default:
      return state;
  }
};

export const PanierProvider = ({ children }) => {

  const [state, dispatch] = useReducer(panierReducer, initialState);
  return (
    <PanierContext.Provider value={{ state, dispatch }}>
      {children}
    </PanierContext.Provider>
  );
};

export const usePanierContext = () => useContext(PanierContext);
