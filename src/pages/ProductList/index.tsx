import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../store";
import {Button} from '@mui/material';
import {
  getDeletedList,
  getFavoriteList,
  getProductList,
  setFavoriteFilter, setPriceFilter,
  setProductPageNumber, updateProductList
} from "../../store/slices/productList.ts";
import {ProductCard} from "../../components/ProductCard";
import {Pagination} from "../../components/Pagination";
import style from "./index.module.scss";

export const ProductList = () => {
  const dispatch = useAppDispatch();
  const {
    status,
    favoriteStatus,
    deletedStatus,
    data,
    pageCount,
    pageNumber,
    filters,
    deleted
  } = useAppSelector(store => store.product.list)

  useEffect(() => {
    if (favoriteStatus === 'idle') {
      dispatch(getFavoriteList())
    }
    if (deletedStatus === 'idle') {
      dispatch(getDeletedList())
    }
    if (status === 'idle' && favoriteStatus === 'success' && deletedStatus === 'success') {
      dispatch(getProductList())
    }
  }, [status, favoriteStatus, deletedStatus, dispatch]);

  const handlePageChange = (_: any, pageNumber: number) => dispatch(setProductPageNumber(pageNumber));
  const handleFavoriteFilter = () => dispatch(setFavoriteFilter(!filters.favorite));
  const handlePriceFilter = () => dispatch(setPriceFilter());

  useEffect(() => {
    dispatch(updateProductList())
  }, [dispatch, filters, deleted]);

  return (
    <div className='container'>
      <div className={style.filters}>
        <Button
          variant="contained"
          color={filters.favorite ? 'secondary' : 'primary'}
          onClick={handleFavoriteFilter}>
          Favorite
        </Button>
        <Button
          variant="contained"
          color={filters.price === 'not_applied' ? 'primary' : 'secondary'}
          onClick={handlePriceFilter}>
          Цена &nbsp;
          {{
            'not_applied': 'off',
            'asc': 'asc',
            'desc': 'desc',
          }[filters.price]}
        </Button>
      </div>
      <div className={style.productCards}>
        {status === 'loading' && <div>Loading...</div>}
        {status === 'error' && <div>Error...</div>}
        {data.map(product => <ProductCard key={product.id} product={product}/>)}
      </div>
      <div className={style.pagination}>
        {pageCount > 1 &&
          <Pagination
            pageCount={pageCount}
            pageNumber={pageNumber}
            handlePageChange={handlePageChange}/>
        }
      </div>
    </div>
  );
}
