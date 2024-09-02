import {Link} from "react-router-dom";
import style from "./index.module.scss";

export const Header = () => (
  <header className={style.header}>
    <nav className='container'>
      <Link to='products/'>Продукты</Link>
      <Link to='create-product/'>Добавить продукт</Link>
    </nav>
  </header>
)
