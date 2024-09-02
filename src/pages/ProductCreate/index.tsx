import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Button} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../store";
import {createProduct, resetCreateSlice} from "../../store/slices/productCreate.ts";
import {invalidateProductList} from "../../store/slices/productList.ts";
import {TFormData} from "../../types/formCreateProduct.ts";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  AVAILABILITY_LIST,
  CATEGORY_LIST,
  RETURN_POLICY_LIST,
  SHIPPING_LIST,
  WARRANTY_LIST
} from "../../utils/utils.ts";
import {Select} from "../../components/Select";
import cn from "classnames";
import style from "./index.module.scss";

export const ProductCreate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {status, data} = useAppSelector(state => state.product.create);

  useEffect(() => {
    if (status === 'success' && data !== null) {
      dispatch(invalidateProductList())
      dispatch(resetCreateSlice());
      navigate(`/products/${data.id}/airtable/`, {replace: true});
    }
  }, [dispatch, navigate, status, data]);

  const {
    register,
    handleSubmit,
    formState: {errors},
    control,
  } = useForm<TFormData>({mode: "onTouched"});

  const onSubmit = (formData: TFormData) => dispatch(createProduct(formData));

  return (
    <div className='container'>
      <form
        className={style.form}
        onSubmit={handleSubmit(onSubmit)}>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Thumbnail:</h3>
          <input
            className={cn({[style.error]: errors.thumbnail})}
            type='file'
            {...register("thumbnail", {
              required: "Обязательное поле",
              validate: {
                fileType: (files) => {
                  if (!files.length) return "Файл не выбран";
                  const file = files[0];
                  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                    return "Неправильный тип файла. Допустимые форматы: jpeg, png, gif, webp";
                  }
                  return true;
                },
                fileSize: (files) => {
                  if (!files.length) return "Файл не выбран";
                  const file = files[0];
                  if (file.size > MAX_FILE_SIZE) {
                    return "Размер файла не должен превышать 5 MB";
                  }
                  return true;
                }
              }
            })}
          />
          <span className={style.errorMessage}>
            {errors?.thumbnail?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Images:</h3>
          <input
            className={cn({[style.error]: errors.images})}
            type='file'
            multiple={true}
            {...register("images", {
              required: "Обязательное поле",
              validate: {
                fileType: (files) => {
                  if (!files.length) return "Файл не выбран";
                  const file = files[0];
                  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                    return "Неправильный тип файла. Допустимые форматы: jpeg, png, gif, webp";
                  }
                  return true;
                },
                fileSize: (files) => {
                  if (!files.length) return "Файл не выбран";
                  const file = files[0];
                  if (file.size > MAX_FILE_SIZE) {
                    return "Размер файла не должен превышать 5 MB";
                  }
                  return true;
                }
              }
            })}
          />
          <span className={style.errorMessage}>
            {errors?.images?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Title:</h3>
          <input
            className={cn({[style.error]: errors.title})}
            type='text'
            placeholder='название товара'
            {...register("title", {
              required: "Обязательное поле",
              minLength: {
                value: 3,
                message: "Минимальная длина 3 символа",
              },
            })}
          />
          <span className={style.errorMessage}>
            {errors?.title?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Description:</h3>
          <textarea
            className={cn({'error': errors.description})}
            placeholder='описание'
            maxLength={1000}
            {...register("description", {
              required: "Обязательное поле",
              minLength: {
                value: 3,
                message: "Минимальная длина 3 символа",
              },
              maxLength: {
                value: 500,
                message: "слишком длинное описание",
              },
            })}
          />
          <span className={style.errorMessage}>
            {errors?.description?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Сategory:</h3>
          <Select
            name='category'
            control={control}
            options={CATEGORY_LIST}
            placeholder='выберите категорию'
            rules={{required: 'обязательное поле'}}
          />
          <span className={style.errorMessage}>
            {errors?.category?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Price:</h3>
          <input
            className={cn({[style.error]: errors.price})}
            type='number'
            step="0.01"
            placeholder='Укажите цену, например 0.01, $'
            {...register("price", {
              required: "Обязательное поле",
              min: {
                value: 0.01,
                message: "Цена должна быть больше 0",
              }
            })}
          />
          <span className={style.errorMessage}>
            {errors?.price?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Stock:</h3>
          <input
            className={cn({[style.error]: errors.stock})}
            type='number'
            step="1"
            placeholder='Укажите сколько товара в наличии'
            {...register("stock", {
              required: "Обязательное поле",
              min: {
                value: 1,
                message: "Количество товара должно быть больше 0",
              }
            })}
          />
          <span className={style.errorMessage}>
            {errors?.stock?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Brand:</h3>
          <input
            className={cn({[style.error]: errors.brand})}
            type='text'
            placeholder='бренд товара'
            {...register("brand", {
              required: "Обязательное поле",
            })}
          />
          <span className={style.errorMessage}>
            {errors?.brand?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>SKU:</h3>
          <input
            className={cn({[style.error]: errors.sku})}
            type='text'
            placeholder='Введите артикул товара, например RCH45Q1A'
            {...register("sku", {
              required: "Обязательное поле",
              minLength: {
                value: 3,
                message: "Минимальная длина 3 символа",
              },
              pattern: {
                value: /^[A-Za-z0-9]+$/,
                message: "Недопустимый формат. Используйте только латинские буквы, или цифры.",
              },
            })}
          />
          <span className={style.errorMessage}>
            {errors?.sku?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Weight:</h3>
          <input
            className={cn({[style.error]: errors.weight})}
            type='number'
            step="1"
            placeholder='Укажите вес товара, lb'
            {...register("weight", {
              required: "Обязательное поле",
              min: {
                value: 1,
                message: "Вес товара должен быть больше 0",
              }
            })}
          />
          <span className={style.errorMessage}>
            {errors?.weight?.message}&nbsp;
          </span>
        </div>

        <div className={style.row}>
          <div className={style.inputBlock}>
            <h3 className={style.required}>Width:</h3>
            <input
              className={cn({[style.error]: errors.width})}
              type='number'
              step="0.01"
              placeholder='Укажите ширину товара, in'
              {...register("width", {
                required: "Обязательное поле",
                min: {
                  value: 1,
                  message: "Ширина товара должна быть больше 0",
                }
              })}
            />
            <span className={style.errorMessage}>
              {errors?.width?.message}&nbsp;
            </span>
          </div>

          <div className={style.inputBlock}>
            <h3 className={style.required}>Height:</h3>
            <input
              className={cn({[style.error]: errors.height})}
              type='number'
              step="0.01"
              placeholder='Укажите высоту товара, in'
              {...register("height", {
                required: "Обязательное поле",
                min: {
                  value: 1,
                  message: "Высота товара должна быть больше 0",
                }
              })}
            />
            <span className={style.errorMessage}>
              {errors?.height?.message}&nbsp;
            </span>
          </div>

          <div className={style.inputBlock}>
            <h3 className={style.required}>Depth:</h3>
            <input
              className={cn({[style.error]: errors.depth})}
              type='number'
              step="0.01"
              placeholder='Укажите глубину товара, in'
              {...register("depth", {
                required: "Обязательное поле",
                min: {
                  value: 1,
                  message: "Глубина товара должна быть больше 0",
                }
              })}
            />
            <span className={style.errorMessage}>
              {errors?.depth?.message}&nbsp;
            </span>
          </div>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Warranty:</h3>
          <Select
            name='warrantyInformation'
            control={control}
            options={WARRANTY_LIST}
            placeholder='Выберите гарантию'
            rules={{required: 'обязательное поле'}}
          />
          <span className={style.errorMessage}>
            {errors?.warrantyInformation?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Shipping:</h3>
          <Select
            name='shippingInformation'
            control={control}
            options={SHIPPING_LIST}
            placeholder='Выберите информацию о доставке'
            rules={{required: 'обязательное поле'}}
          />
          <span className={style.errorMessage}>
            {errors?.shippingInformation?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Availability Status:</h3>
          <Select
            name='availabilityStatus'
            control={control}
            options={AVAILABILITY_LIST}
            placeholder='Выберите статус доступности'
            rules={{required: 'обязательное поле'}}
          />
          <span className={style.errorMessage}>
            {errors?.availabilityStatus?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Return Policy:</h3>
          <Select
            name='returnPolicy'
            control={control}
            options={RETURN_POLICY_LIST}
            placeholder='Выберите условия возврата'
            rules={{required: 'обязательное поле'}}
          />
          <span className={style.errorMessage}>
            {errors?.returnPolicy?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Minimum Order:</h3>
          <input
            className={cn({[style.error]: errors.stock})}
            type='number'
            step="1"
            placeholder='Укажите миинмальное количество для заказа'
            {...register("minimumOrderQuantity", {
              required: "Обязательное поле",
              min: {
                value: 1,
                message: "Количество товара должно быть больше 0",
              }
            })}
          />
          <span className={style.errorMessage}>
            {errors?.minimumOrderQuantity?.message}&nbsp;
          </span>
        </div>

        <div className={style.inputBlock}>
          <h3 className={style.required}>Barcode:</h3>
          <input
            className={cn({[style.error]: errors.barcode})}
            type='number'
            placeholder='Введите 12-и значный UPC barcode'
            {...register("barcode", {
              required: "Обязательное поле",
              pattern: {
                value: /^[0-9]{12}$/,
                message: "Введите корректный 12-и значный UPC barcode",
              },
            })}
          />
          <span className={style.errorMessage}>
            {errors?.barcode?.message}&nbsp;
          </span>
        </div>

        <Button
          type='submit'
          variant="contained"
          color='primary'>
          Create Product
        </Button>
      </form>
    </div>
  )
}
