const fs = require('fs');
const pages = [
  'customer/HomePage', 'customer/ProductListPage', 'customer/ProductDetailPage', 'customer/CartPage', 
  'customer/CheckoutPage', 'customer/MyOrdersPage', 'customer/OrderDetailPage', 
  'admin/AdminDashboard', 'admin/AdminProducts', 'admin/AdminCategories', 'admin/AdminOrders', 
  'admin/AdminCoupons', 'admin/AdminCustomers'
];

pages.forEach(p => {
  const name = p.split('/')[1];
  const content = `import React from 'react';

const ${name} = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">${name}</h1>
    </div>
  );
};

export default ${name};
`;
  fs.writeFileSync(`src/pages/${p}.jsx`, content);
});
