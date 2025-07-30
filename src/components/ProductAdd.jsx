import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  ten_san_pham: Yup.string().required('Tên sản phẩm là bắt buộc').max(100, 'Tên sản phẩm không được dài quá 100 ký tự'),
  ngay_nhap: Yup.date().required('Ngày nhập là bắt buộc').max(new Date(), 'Ngày nhập không được lớn hơn ngày hiện tại'),
  gia_ban: Yup.number().required('Giá bán là bắt buộc').positive('Giá bán phải là số dương'),
  so_luong: Yup.number().required('Số lượng là bắt buộc').integer('Số lượng phải là số nguyên').min(1, 'Số lượng phải lớn hơn 0'),
  loai_san_pham_id: Yup.string().required('Vui lòng chọn loại sản phẩm'),
});

function ProductAdd() {
  const navigate = useNavigate();
  const [productTypes, setProductTypes] = useState([]);
  const initialValues = {
    ten_san_pham: '',
    ngay_nhap: '',
    gia_ban: '',
    so_luong: '',
    loai_san_pham_id: '',
  };

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await api.getProductTypes();
        setProductTypes(response.data);
      } catch (error) {
        toast.error("Không thể tải danh sách loại sản phẩm.");
      }
    };
    fetchProductTypes();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSubmit = { ...values, loai_san_pham_id: parseInt(values.loai_san_pham_id, 10) };
      await api.addProduct(dataToSubmit);
      toast.success('Thêm sản phẩm mới thành công!');
      navigate('/');
    } catch (error) {
      toast.error('Thêm sản phẩm thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white max-w-3xl mx-auto rounded-xl shadow-lg">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form id="add-form">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Thêm sản phẩm mới</h2>
              <p className="mt-2 text-sm text-slate-600">Điền thông tin chi tiết cho sản phẩm mới.</p>
              
              <div className="mt-8 space-y-6">
                <div>
                  <label htmlFor="ten_san_pham" className="block text-sm font-medium text-slate-700">Tên sản phẩm</label>
                  <Field name="ten_san_pham" type="text" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  <ErrorMessage name="ten_san_pham" component="p" className="mt-2 text-sm text-red-600" />
                </div>
                
                <div>
                  <label htmlFor="gia_ban" className="block text-sm font-medium text-slate-700">Giá bán</label>
                  <Field name="gia_ban" type="number" placeholder="Ví dụ: 250000" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  <ErrorMessage name="gia_ban" component="p" className="mt-2 text-sm text-red-600" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="loai_san_pham_id" className="block text-sm font-medium text-slate-700">Loại sản phẩm</label>
                    <Field name="loai_san_pham_id" as="select" className="mt-1 block w-full rounded-lg border-slate-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                      <option value="">Chọn loại</option>
                      {productTypes.map((type) => <option key={type.id} value={type.id}>{type.ten_loai}</option>)}
                    </Field>
                    <ErrorMessage name="loai_san_pham_id" component="p" className="mt-2 text-sm text-red-600" />
                  </div>
                  <div>
                    <label htmlFor="so_luong" className="block text-sm font-medium text-slate-700">Số lượng</label>
                    <Field name="so_luong" type="number" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                    <ErrorMessage name="so_luong" component="p" className="mt-2 text-sm text-red-600" />
                  </div>
                </div>
                <div>
                  <label htmlFor="ngay_nhap" className="block text-sm font-medium text-slate-700">Ngày nhập</label>
                  <Field name="ngay_nhap" type="date" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  <ErrorMessage name="ngay_nhap" component="p" className="mt-2 text-sm text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex justify-end gap-x-3">
              <button type="button" onClick={() => navigate('/')} className="rounded-lg bg-white py-2 px-4 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                Hủy
              </button>
              <button type="submit" form="add-form" disabled={isSubmitting} className="inline-flex justify-center rounded-lg bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                {isSubmitting ? 'Đang thêm...' : 'Thêm sản phẩm'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ProductAdd;