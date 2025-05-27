import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AddProductPage from "./pages/admin/AddProductPage";
import GenderPage from "./pages/client/GenderPage";
import HomePage from "./pages/client/HomePage";
import ProductPage from "./pages/client/ProductPage";
import EditProduct from "./pages/admin/EditProduct";
import Verification from "./pages/VerificationPage";
import SearchPage from "./pages/client/SearchPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:gender" element={<GenderPage />} />
          <Route path="/:gender/:category" element={<GenderPage />} />
          <Route
            path="/:gender/:category/:categoryItem"
            element={<GenderPage />}
          />

          <Route path="/product/:gender/:id" element={<ProductPage />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/search" element={<SearchPage />} />

          <Route path="/admin/add" element={<AddProductPage />} />
          <Route path="/admin/edit" element={<EditProduct />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
