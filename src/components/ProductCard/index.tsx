import React from "react";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";
import {TProductCard} from "../../types/product.ts";
import {useAppDispatch, useAppSelector} from "../../store";
import {deleteProduct, updateFavorite} from "../../store/slices/productList.ts";
import {formatCurrency} from "../../utils/utils.ts";
import FavoriteIcon from "../../assets/heart.svg?react";
import DeleteIcon from "../../assets/trash-bin.svg?react";
import cn from "classnames";
import style from "./index.module.scss";

export const ProductCard: React.FC<{ product: TProductCard }> = ({product}) => {
  const dispatch = useAppDispatch();
  const {title, description, thumbnail, id, price, apiType} = product;
  const {favorite: favoriteObj, updateFavoriteStatus, deleteProductStatus} = useAppSelector(state => state.product.list);
  const isFavorite = favoriteObj[id]

  const handleFavoriteClick = () => {
    dispatch(updateFavorite({type: isFavorite ? 'remove' : 'add', id}));
  }
  const handleDeleteClick = () => {
    dispatch(deleteProduct(id));
  }

  return (
    <div className={style.container}>
      <div className={style.buttonsRow}>
        <Button
          className={cn(style.favoriteBtn, {[style.isFavorite]: isFavorite})}
          type='button'
          variant="contained"
          color={updateFavoriteStatus[id] === 'loading' ? 'warning' : 'primary'}
          onClick={handleFavoriteClick}>
          <FavoriteIcon/>
        </Button>
        <Button
          className={style.deleteBtn}
          type='button'
          variant="contained"
          color={deleteProductStatus[id] === 'loading' ? 'warning' : 'primary'}
          onClick={handleDeleteClick}>
          <DeleteIcon/>
        </Button>
      </div>
      <Link
        className={style.link}
        to={`/products/${id}/${apiType}/`}>
        <img
          className={style.image}
          src={thumbnail}
          alt={title}
          loading='lazy'
        />
        <p>{formatCurrency(price)}</p>
        <h2 className={style.title}>{title}</h2>
        <p className={style.description}>{description}</p>
      </Link>
    </div>
  )
}
