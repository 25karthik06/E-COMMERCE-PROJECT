const fs = require('fs');

const apis = {
  'productApi': `import axiosInstance from './axiosInstance';

export const getProducts = () => axiosInstance.get('/products');
export const getProductById = (id) => axiosInstance.get(\`/products/\${id}\`);
export const adminGetProducts = () => axiosInstance.get('/admin/products');
export const adminCreateProduct = (data) => axiosInstance.post('/admin/products', data);
export const adminUpdateProduct = (id, data) => axiosInstance.put(\`/admin/products/\${id}\`, data);
export const adminDeleteProduct = (id) => axiosInstance.delete(\`/admin/products/\${id}\`);
`,
  'categoryApi': `import axiosInstance from './axiosInstance';

export const getCategories = () => axiosInstance.get('/categories');
export const adminCreateCategory = (data) => axiosInstance.post('/admin/categories', data);
export const adminUpdateCategory = (id, data) => axiosInstance.put(\`/admin/categories/\${id}\`, data);
export const adminDeleteCategory = (id) => axiosInstance.delete(\`/admin/categories/\${id}\`);
`,
  'cartApi': `import axiosInstance from './axiosInstance';

export const getCart = () => axiosInstance.get('/cart');
export const addToCart = (data) => axiosInstance.post('/cart/add', data);
export const updateCartItem = (data) => axiosInstance.put('/cart/update', data);
export const removeFromCart = (productId) => axiosInstance.delete(\`/cart/remove/\${productId}\`);
`,
  'orderApi': `import axiosInstance from './axiosInstance';

export const checkout = (data) => axiosInstance.post('/orders/checkout', data);
export const getMyOrders = () => axiosInstance.get('/orders/my-orders');
export const getOrderById = (id) => axiosInstance.get(\`/orders/\${id}\`);
export const adminGetOrders = () => axiosInstance.get('/admin/orders');
export const adminUpdateOrderStatus = (id, status) => axiosInstance.put(\`/admin/orders/\${id}/status?status=\${status}\`);
`,
  'couponApi': `import axiosInstance from './axiosInstance';

export const applyCoupon = (code) => axiosInstance.post(\`/coupons/apply?code=\${code}\`);
export const adminGetCoupons = () => axiosInstance.get('/admin/coupons');
export const adminGetCouponById = (id) => axiosInstance.get(\`/admin/coupons/\${id}\`);
export const adminCreateCoupon = (data) => axiosInstance.post('/admin/coupons', data);
export const adminUpdateCoupon = (id, data) => axiosInstance.put(\`/admin/coupons/\${id}\`, data);
`,
  'customerApi': `import axiosInstance from './axiosInstance';

export const adminGetCustomers = () => axiosInstance.get('/admin/customers');
export const adminGetCustomerById = (id) => axiosInstance.get(\`/admin/customers/\${id}\`);
`
};

for (const [name, content] of Object.entries(apis)) {
  fs.writeFileSync('src/api/' + name + '.js', content);
}
