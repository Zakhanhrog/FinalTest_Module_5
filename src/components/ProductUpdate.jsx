import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const validationSchema = Yup.object().shape({
  ten_san_pham: Yup.string().required('Tên sản phẩm là bắt buộc').max(100, 'Tên sản phẩm không được dài quá 100 ký tự'),
  ngay_nhap: Yup.date().required('Ngày nhập là bắt buộc').max(new Date(), 'Ngày nhập không được lớn hơn ngày hiện tại'),
  so_luong: Yup.number().required('Số lượng là bắt buộc').integer('Số lượng phải là số nguyên').min(1, 'Số lượng phải lớn hơn 0'),
  loai_san_pham_id: Yup.string().required('Vui lòng chọn loại sản phẩm'),
});

const LoadingSpinner = () => <div className="flex justify-center items-center p-12"><svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>;

function ProductUpdate() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [productRes, typesRes] = await Promise.all([api.getProductById(productId), api.getProductTypes()]);
        if (isMounted) {
          const productData = { ...productRes.data, ngay_nhap: format(new Date(productRes.data.ngay_nhap), 'yyyy-MM-dd') };
          setInitialValues(productData);
          setProductTypes(typesRes.data);
        }
      } catch (error) {
        if (isMounted) { toast.error('Không tìm thấy sản phẩm!'); navigate('/'); }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [productId, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSubmit = { ...values, loai_san_pham_id: parseInt(values.loai_san_pham_id, 10) };
      await api.updateProduct(productId, dataToSubmit);
      toast.success('Cập nhật sản phẩm thành công!');
      navigate('/');
    } catch (error) {
      toast.error('Cập nhật sản phẩm thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) return <LoadingSpinner />;

  return (
    <div className="bg-white max-w-3xl mx-auto rounded-xl shadow-lg">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ isSubmitting }) => (
          <Form id="update-form">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Cập nhật thông tin</h2>
              <p className="mt-2 text-sm text-slate-600">Chỉnh sửa các thông tin cần thiết cho sản phẩm.</p>
              
              <div className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Giá bán ban đầu</label>
                  <div className="mt-1">
                    <input type="text" value={`${initialValues.gia_ban.toLocaleString()} VNĐ`} readOnly disabled className="block w-full rounded-lg border-slate-300 bg-slate-100 shadow-sm sm:text-sm"/>
                  </div>
                </div>
                <div>
                  <label htmlFor="ten_san_pham" className="block text-sm font-medium text-slate-700">Tên sản phẩm</label>
                  <Field name="ten_san_pham" type="text" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  <ErrorMessage name="ten_san_pham" component="p" className="mt-2 text-sm text-red-600" />
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
              <button type="submit" form="update-form" disabled={isSubmitting} className="inline-flex justify-center rounded-lg bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ProductUpdate;