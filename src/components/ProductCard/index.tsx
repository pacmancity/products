import React from "react";
import {Link} from "react-router-dom";
import cn from "classnames";
import {TProductCard} from "../../types/product.ts";
import {useAppDispatch, useAppSelector} from "../../store";
import {deleteProduct, updateFavorite} from "../../store/slices/productList.ts";
import {formatCurrency} from "../../utils/utils.ts";
import FavoriteIcon from "../../assets/heart.svg?react";
import DeleteIcon from "../../assets/trash-bin.svg?react";
import style from "./index.module.scss";


import {Button} from "@mui/material";

export const ProductCard: React.FC<{ product: TProductCard }> = ({product}) => {
  const dispatch = useAppDispatch();
  const {title, description, thumbnail, id, price, apiType} = product;
  const favoriteObj = useAppSelector(state => state.product.list.favorite);
  const isFavorite = favoriteObj[id]

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(updateFavorite({type: isFavorite ? 'remove' : 'add', id}));
  }
  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(deleteProduct(id));
  }



  return (
    <div className={style.container}>
      <div className={style.buttonsRow}>
        <Button
          className={cn(style.favoriteBtn, {[style.isFavorite]: isFavorite})}
          type='button'
          variant="contained"
          color='primary'
          onClick={handleFavoriteClick}>
          <FavoriteIcon/>
        </Button>
         <Button
           className={style.deleteBtn}
           type='button'
           variant="contained"
           color='primary'
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
