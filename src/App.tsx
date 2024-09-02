import {Navigate, Route, Routes} from "react-router-dom";
import {Layout} from "./components/Layout";
import {ProductList} from "./pages/ProductList";
import {ProductDetail} from "./pages/ProductDetail";
import {ProductCreate} from "./pages/ProductCreate";
import {NotFound} from "./pages/NotFound";

export const App = () => (
  <Routes>
    <Route element={<Layout/>}>
      <Route path="/" element={<Navigate to="/products/" replace/>}/>
      <Route index path='/products/' element={<ProductList/>}/>
      <Route path='/products/:id/:apiType/' element={<ProductDetail/>}/>
      <Route path='/create-product/' element={<ProductCreate/>}/>
      <Route path='/*' element={<NotFound/>}/>
    </Route>
  </Routes>
)
