import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {TProduct} from "../../types/product.ts";
import {dummyApi, productApi} from "../api.ts";

type ProductState = {
  data: TProduct | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
};

type TInitialState = Record<string, ProductState>;

const initialState: TInitialState = {};

export const getProduct = createAsyncThunk<TProduct, { productId: string, apiType: string }, { rejectValue: string }>(
  'get_product',
  async ({productId, apiType}, {rejectWithValue}) => {
    try {
      if (apiType === 'dummyApi') {
        const response = await dummyApi.get(`products/${productId}`);
        return response.data;
      } else if (apiType === 'airtable') {
        const response = await productApi.get(`/${productId}`);
        const id = response.data.id
        const {dimensions, reviews, meta, images, ...data} = response.data.fields;
        return {
          id,
          dimensions: JSON.parse(dimensions),
          reviews: JSON.parse(reviews),
          meta: JSON.parse(meta),
          images: JSON.parse(images),
          ...data
        };
      } else {
        return rejectWithValue('Invalid API type');
      }
    } catch {
      return rejectWithValue('Failed to fetch product');
    }
  }
);

const productDetail = createSlice({
  name: 'product_detail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state, action) => {
        const {productId} = action.meta.arg;
        state[productId] = {
          data: null,
          status: 'loading',
          error: null,
        };
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        const product = action.payload;
        state[product.id] = {
          data: product,
          status: 'success',
          error: null,
        };
      })
      .addCase(getProduct.rejected, (state, action) => {
        const {productId} = action.meta.arg;
        state[productId] = {
          data: null,
          status: 'error',
          error: action.payload as string,
        };
      });
  },
});

export default productDetail.reducer;
