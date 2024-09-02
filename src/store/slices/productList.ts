import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TProductCard, TProductHeader} from "../../types/product.ts";
import {deletedApi, dummyApi, favoriteApi, productApi} from "../api.ts";
import {RootState} from "../index.ts";
import {filterDeleted, paginate} from "../../utils/utils.ts";

type PriceFilter = 'not_applied' | 'asc' | 'desc';

type InitialState = {
  productList: TProductCard[];
  data: TProductCard[];
  error: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';

  pageNumber: number;
  pageCount: number;

  filters: {
    favorite: boolean;
    price: PriceFilter;
  }

  favorite: Record<string, true>;
  favoriteStatus: 'idle' | 'loading' | 'success' | 'error';
  favoriteError: string | null;
  updateFavoriteStatus: Record<string, 'idle' | 'loading' | 'success' | 'error'>;
  updateFavoriteError: Record<string, string | null>;

  deleted: Record<string, true>;
  deletedStatus: 'idle' | 'loading' | 'success' | 'error';
  deletedError: string | null;
  deleteProductStatus: Record<string, 'idle' | 'loading' | 'success' | 'error'>;
  deleteProductError: Record<string, string | null>;
}

type UpdateFavoriteAction = {
  type: 'add' | 'remove';
  id: number;
}

const initialState: InitialState = {
  productList: [],
  data: [],
  error: null,
  status: 'idle',

  pageNumber: 1,
  pageCount: 1,

  filters: {
    favorite: false,
    price: 'not_applied'
  },

  favorite: {},
  favoriteStatus: 'idle',
  favoriteError: null,
  updateFavoriteStatus: {},
  updateFavoriteError: {},

  deleted: {},
  deletedStatus: 'idle',
  deletedError: null,
  deleteProductStatus: {},
  deleteProductError: {}
};

export const getProductList = createAsyncThunk<TProductCard[], undefined, { rejectValue: string }>(
  'get_product_list',
  async (_, {rejectWithValue}) => {
    try {
      const [dummyResponse, airtableResponse] = await Promise.all([
        dummyApi.get('products', {params: {limit: 0}}),
        productApi.get('/')
      ]);

      const dummyProducts = dummyResponse.data.products.map((item: TProductCard) => ({...item, apiType: 'dummyApi'}));
      const airtableProducts = airtableResponse.data.records.map((record: { fields: TProductHeader, id: string }) => ({
        id: record.id,
        ...record.fields,
        apiType: 'airtable'
      }));
      return [...dummyProducts, ...airtableProducts];
    } catch {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const getFavoriteList = createAsyncThunk<Record<string, true>, undefined, {
  rejectValue: string
}>(
  'get_favorite_list',
  async (_, {rejectWithValue}) => {
    try {
      const response = await favoriteApi.get('/');
      return response.data.records[0].fields.favorite
        .split(',')
        .reduce((acc: Record<string, true>, cur: string) => {
          acc[cur] = true;
          return acc
        }, {});
    } catch {
      return rejectWithValue('Failed to fetch favorite list');
    }
  }
);

export const updateFavorite = createAsyncThunk<Record<string, true>, UpdateFavoriteAction, {
  rejectValue: string,
  state: RootState
}>(
  'update_favorite_list',
  async ({type, id}, {rejectWithValue, getState}) => {
    try {
      const favoriteObj = {...getState().product.list.favorite};
      if (type === 'add') {
        favoriteObj[id] = true;
      }
      if (type === 'remove') {
        delete favoriteObj[id];
      }
      const favoriteString = Object.keys(favoriteObj).join(',');
      const RECORD_ID = 'recxpNLzCPK4hd8Ar';
      const response = await favoriteApi.patch(`/${RECORD_ID}`, {
        fields: {
          favorite: favoriteString,
        },
      });
      return response.data.fields.favorite
        .split(',')
        .reduce((acc: Record<string, true>, cur: string) => {
          acc[cur] = true;
          return acc
        }, {});
    } catch {
      return rejectWithValue('Failed to save favorite list');
    }
  }
);

export const getDeletedList = createAsyncThunk<Record<string, true>, undefined, {
  rejectValue: string
}>(
  'get_deleted_list',
  async (_, {rejectWithValue}) => {
    try {
      const response = await deletedApi.get('/');
      const deleted = response.data.records[0].fields
      if (Object.keys(deleted).length === 0) {
        return [];
      }
      return response.data.records[0].fields.deleted
        .split(',')
        .reduce((acc: Record<string, true>, cur: string) => {
          acc[cur] = true;
          return acc
        }, {});
    } catch {
      return rejectWithValue('Failed to fetch deleted list');
    }
  }
);

export const deleteProduct = createAsyncThunk<Record<string, true>, number, {
  rejectValue: string,
  state: RootState
}>(
  'delete_product',
  async (id, {rejectWithValue, getState}) => {
    try {
      const deletedObj = {...getState().product.list.deleted};
      deletedObj[id] = true;
      const deletedString = Object.keys(deletedObj).join(',');
      const RECORD_ID = 'recufJd2sy1CGWTqx';
      const response = await favoriteApi.patch(`/${RECORD_ID}`, {
        fields: {
          deleted: deletedString,
        },
      });
      return response.data.fields.deleted
        .split(',')
        .reduce((acc: Record<string, true>, cur: string) => {
          acc[cur] = true;
          return acc
        }, {});
    } catch {
      return rejectWithValue('Failed to save favorite list');
    }
  }
);

const productList = createSlice({
  name: 'product_list',
  initialState,
  reducers: {
    setProductPageNumber(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
      state.data = paginate(state.productList, state.pageNumber);
    },
    setFavoriteFilter(state, action: PayloadAction<boolean>) {
      state.filters.favorite = action.payload;
    },
    setPriceFilter(state) {
      const nextFilter: Record<PriceFilter, PriceFilter> = {
        'not_applied': 'asc',
        'asc': 'desc',
        'desc': 'not_applied',
      };
      state.filters.price = nextFilter[state.filters.price];
    },
    updateProductList(state) {
      let filteredProducts = filterDeleted(state.productList, state.deleted);
      if (state.filters.price !== 'not_applied') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (state.filters.price === 'asc') {
            return a.price - b.price;
          } else if (state.filters.price === 'desc') {
            return b.price - a.price;
          }
          return 0;
        });
      } else {
        filteredProducts = filteredProducts.sort((a, b) => a.id - b.id);
      }
      state.productList = filteredProducts;
      if (state.filters.favorite) {
        filteredProducts = filteredProducts.filter(product => state.favorite[product.id]);
      }
      state.pageCount = Math.ceil(filteredProducts.length / 6);
      if (state.pageNumber > state.pageCount) {
        state.pageNumber = state.pageCount > 0 ? state.pageCount : 1;
      }
      state.data = paginate(filteredProducts, state.pageNumber);
    },
    invalidateProductList(state) {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductList.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.status = 'success';
        state.productList = filterDeleted(action.payload, state.deleted)
        state.pageCount = Math.ceil(state.productList.length / 6);
        state.data = paginate(state.productList, state.pageNumber);
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      })

      .addCase(getFavoriteList.pending, (state) => {
        state.favoriteStatus = 'loading';
        state.favoriteError = null;
      })
      .addCase(getFavoriteList.fulfilled, (state, action) => {
        state.favoriteStatus = 'success';
        state.favorite = action.payload;
      })
      .addCase(getFavoriteList.rejected, (state, action) => {
        state.favoriteStatus = 'error';
        state.favoriteError = action.payload as string;
      })

      .addCase(updateFavorite.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.updateFavoriteStatus[id] = 'loading';
        state.updateFavoriteError[id] = null;
      })
      .addCase(updateFavorite.fulfilled, (state, action) => {
        const id = action.meta.arg.id;
        state.updateFavoriteStatus[id] = 'success';
        state.favorite = action.payload;
      })
      .addCase(updateFavorite.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.updateFavoriteStatus[id] = 'error';
        state.updateFavoriteError[id] = action.payload as string;
      })

      .addCase(getDeletedList.pending, (state) => {
        state.deletedStatus = 'loading';
        state.deletedError = null;
      })
      .addCase(getDeletedList.fulfilled, (state, action) => {
        state.deletedStatus = 'success';
        state.deleted = action.payload;
      })
      .addCase(getDeletedList.rejected, (state, action) => {
        state.deletedStatus = 'error';
        state.deletedError = action.payload as string;
      })

      .addCase(deleteProduct.pending, (state, action) => {
        const id = action.meta.arg;
        state.deleteProductStatus[id] = 'loading';
        state.deleteProductError[id] = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.deleteProductStatus[id] = 'success';
        state.deleted = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        const id = action.meta.arg;
        state.deleteProductStatus[id] = 'error';
        state.deleteProductError[id] = action.payload as string;
      })
  },
});

export const {
  setProductPageNumber,
  setFavoriteFilter,
  updateProductList,
  setPriceFilter,
  invalidateProductList,
} = productList.actions;
export default productList.reducer;
