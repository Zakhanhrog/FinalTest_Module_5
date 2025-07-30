import { Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductUpdate from './components/ProductUpdate';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="bg-slate-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold leading-tight text-slate-900">
            Clothing Management
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/update/:productId" element={<ProductUpdate />} />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
    </div>
  );
}

export default App;