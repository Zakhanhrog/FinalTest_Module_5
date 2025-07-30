import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const SortIcon = ({ order }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 group-hover:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {order === 'asc' ? <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />}
  </svg>
);
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;

const ITEMS_PER_PAGE = 5;

function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const initialLoad = async () => {
      try {
        const [productResponse, typeResponse] = await Promise.all([api.getProducts(), api.getProductTypes()]);
        setAllProducts(productResponse.data);
        setProductTypes(typeResponse.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu từ server.");
      }
    };
    initialLoad();
  }, []);

  const processedProducts = useMemo(() => {
    let results = [...allProducts];
    if (searchTerm.trim()) results = results.filter(p => p.ten_san_pham.toLowerCase().includes(searchTerm.trim().toLowerCase()));
    if (selectedType) results = results.filter(p => p.loai_san_pham_id === parseInt(selectedType));
    if (results.length === 0 && (searchTerm.trim() || selectedType)) toast.info("Không tìm thấy sản phẩm nào phù hợp.");
    results.sort((a, b) => sortOrder === 'asc' ? a.so_luong - b.so_luong : b.so_luong - a.so_luong);
    return results;
  }, [searchTerm, selectedType, allProducts, sortOrder]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedType]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = processedProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSortToggle = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
          <div>
            <label htmlFor="search-term" className="sr-only">Tìm theo tên</label>
            <input type="text" id="search-term" className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Tìm tên sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div>
            <label htmlFor="product-type" className="sr-only">Lọc theo loại</label>
            <select id="product-type" className="block w-full rounded-lg border-slate-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">Tất cả loại</option>
              {productTypes.map((type) => <option key={type.id} value={type.id}>{type.ten_loai}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleSortToggle} className="group flex items-center justify-center gap-2 rounded-lg bg-white py-2 px-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all duration-150">
          <SortIcon order={sortOrder} />
          <span>Số lượng</span>
        </button>
      </div>

      <div className="bg-white overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 rounded-xl">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mã SP</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tên sản phẩm</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ngày nhập</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Số lượng</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Chức năng</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">#{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{product.ten_san_pham}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{format(new Date(product.ngay_nhap), 'dd/MM/yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.so_luong < 50 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {product.so_luong}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/update/${product.id}`} className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150">
                      Cập nhật
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-16 px-6 text-sm text-slate-500">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <p className="mt-2">Không tìm thấy sản phẩm nào.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-between">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="inline-flex items-center gap-2 rounded-lg bg-white py-2 pl-2 pr-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeftIcon />
            <span>Trước</span>
          </button>
          <span className="text-sm font-medium text-slate-600">
            Trang {currentPage} / {totalPages}
          </span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="inline-flex items-center gap-2 rounded-lg bg-white py-2 pl-3 pr-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <span>Sau</span>
            <ChevronRightIcon />
          </button>
        </nav>
      )}
    </div>
  );
}

export default ProductList;