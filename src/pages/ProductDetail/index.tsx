import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Barcode from "react-barcode";
import {useAppDispatch, useAppSelector} from "../../store";
import {getProduct} from "../../store/slices/productDetail.ts";
import {formatCurrency, toMillimeters, formatDate} from "../../utils/utils.ts";
import StarIcon from "../../assets/star.svg?react";
import cn from "classnames";
import style from "./index.module.scss";

export const ProductDetail = () => {
  const dispatch = useAppDispatch();
  const {id, apiType} = useParams();
  const navigate = useNavigate();
  const products = useAppSelector(state => state.product.detail);

  useEffect(() => {
    dispatch(getProduct({productId: id!, apiType: apiType!}));
  }, [dispatch, id, apiType]);

  useEffect(() => {
    if (!['dummyApi', 'airtable'].includes(apiType!)) navigate("/not-found");
  }, [navigate, id, apiType]);

  if (products[id!]?.status === 'error') {
    return <div className='container'>Error...</div>
  }
  if (products[id!]?.status !== 'success') {
    return <div className='container'>Loading...</div>
  }

  const data = products[id!].data!;

  return (
    <div className={cn('container', style.container)}>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <div className={style.gallery}>
        {data.images.map(image => <img key={image} src={image} alt={`product ${data.title}`}/>)}
      </div>
      {<img className={style.qrCode} src={data.meta.qrCode} alt="qr code"/>}
      <Barcode value={data.meta.barcode}/>
      <table className={style.table}>
        <tbody>
        <tr>
          <td>Категория:</td>
          <td>{data.category}</td>
        </tr>
        <tr>
          <td>Цена:</td>
          <td>{formatCurrency(data.price)}</td>
        </tr>
        <tr>
          <td>Рейтинг:</td>
          <td className={style.rating}>
            <span>{data.rating}</span>
            <div style={{width: `${data.rating * 25}px`}}>
              {Array.from({length: 5}).map((_, index) => (
                <StarIcon key={index}/>
              ))}
            </div>
          </td>
        </tr>
        <tr>
          <td>Бренд:</td>
          <td>{data.brand}</td>
        </tr>
        <tr>
          <td>SKU:</td>
          <td>{data.sku}</td>
        </tr>
        <tr>
          <td>вес упаковки:</td>
          <td>{Math.round(data.weight * 453.59237)} гр</td>
        </tr>
        <tr>
          <td>Габариты упаковки ШxВxГ :</td>
          <td className={style.size}>
            <span>{toMillimeters(data.dimensions.width)}</span>
            <span>{toMillimeters(data.dimensions.height)}</span>
            <span>{toMillimeters(data.dimensions.width)}</span>
          </td>
        </tr>
        <tr>
          <td>Гаранития :</td>
          <td>{data.warrantyInformation}</td>
        </tr>
        <tr>
          <td>Доставка :</td>
          <td>{data.shippingInformation}</td>
        </tr>
        <tr>
          <td>Наличие на складе :</td>
          <td>{data.availabilityStatus}</td>
        </tr>
        <tr>
          <td>Возврат :</td>
          <td>{data.returnPolicy}</td>
        </tr>
        <tr>
          <td>Минимальный заказ :</td>
          <td>{data.minimumOrderQuantity}</td>
        </tr>
        </tbody>
      </table>

      {data.reviews.length > 0 && <h2 className={style.reviewTitle}>Отзывы</h2>}
      {data.reviews.map((review, index) => (
        <div className={style.review} key={index}>
          <h3>{review.reviewerName}</h3>
          <p>{review.reviewerEmail}</p>
          <div className={style.rating}>
            <span>{review.rating}</span>
            <div style={{width: `${review.rating * 25}px`}}>
              {Array.from({length: 5}).map((_, index) => (
                <StarIcon key={index}/>
              ))}
            </div>
          </div>
          <p>{review.comment}</p>
          <p>{formatDate(review.date)}</p>
        </div>
      ))}
    </div>
  )
}
