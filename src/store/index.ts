import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import productList from "./slices/productList";
import productDetail from "./slices/productDetail";
import productCreate from "./slices/productCreate";

const productReducer = combineReducers({
  list: productList,
  detail: productDetail,
  create: productCreate,
});

export const store = configureStore({
  reducer: {
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
