import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {TProduct} from "../../types/product.ts";
import {TFormData} from "../../types/formCreateProduct.ts";
import {productApi, uploadThumbnail, uploadImages} from "../api.ts";

type TProductCreated = TProduct & { id: number };

type TInitialState = {
  data: TProductCreated | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
};

const initialState: TInitialState = {
  data: {} as TProductCreated,
  status: 'idle',
  error: null
};

export const createProduct = createAsyncThunk<TProductCreated, TFormData, { rejectValue: string }>(
  'create_product',
  async (formData, {rejectWithValue}) => {
    try {
      const {
        width,
        height,
        depth,
        price,
        availabilityStatus,
        category,
        minimumOrderQuantity,
        returnPolicy,
        shippingInformation,
        stock,
        warrantyInformation,
        weight,
        barcode,
        thumbnail,
        images,
        ...restData
      } = formData;
      let thumbnailURL;
      let imagesUrlList;

      try {
        thumbnailURL = await uploadThumbnail(thumbnail[0]);
      } catch {
        return rejectWithValue('Failed to upload thumbnail');
      }
      try {
        imagesUrlList = await uploadImages([...images]);
      } catch {
        return rejectWithValue('Failed to upload images');
      }
      const now = new Date().toISOString();

      const response = await productApi.post('/', {
        fields: {
          dimensions: JSON.stringify({width, height, depth}),
          reviews: '[]',
          meta: JSON.stringify({
            createdAt: now,
            updatedAt: now,
            barcode: barcode,
            "qrCode": "https://assets.dummyjson.com/public/qr-code.png"
          }),
          images: JSON.stringify(imagesUrlList),
          thumbnail: thumbnailURL,
          price: Number(price),
          availabilityStatus: availabilityStatus.label,
          category: category.label,
          minimumOrderQuantity: Number(minimumOrderQuantity),
          returnPolicy: returnPolicy.label,
          shippingInformation: shippingInformation.label,
          stock: Number(stock),
          warrantyInformation: warrantyInformation.label,
          weight: Number(weight),
          ...restData,
        }
      });
      return {...response.data.fields, id: response.data.id};
    } catch {
      return rejectWithValue('Failed to create product');
    }
  }
);

const productCreate = createSlice({
  name: 'product_create',
  initialState,
  reducers: {
    resetCreateSlice(state) {
      state.data = {} as TProductCreated;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'success';
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });
  },
});

export const {resetCreateSlice} = productCreate.actions;
export default productCreate.reducer;
