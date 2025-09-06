import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Home } from './layout/home/home';
import { Contact } from './layout/contact/contact';
import { Cart } from './layout/cart/cart';
import { Login } from './layout/login/login';
import { FAQ } from './layout/faq/faq';
import { AdminGuard } from './core/guards/admin-guard';
import { Register } from './layout/register/register';
import { Profile } from './layout/profile/profile';
import { Productlist } from './layout/productlist/productlist';
import { ContactList } from './dashboard/contact-list/contact-list';
import { PindingOrders } from './dashboard/pinding-orders/pinding-orders';
import { OrdersList } from './dashboard/orders-list/orders-list';
import { TestimonialList } from './dashboard/testimonial-list/testimonial-list';
import { UnseenTestimonial } from './dashboard/unseen-testimonial/unseen-testimonial';
import { UnApproveTestimonial } from './dashboard/un-approve-testimonial/un-approve-testimonial';
import { FAQList } from './dashboard/faqlist/faqlist';
import { Dashboard } from './dashboard/dashboard';
import { Report } from './dashboard/report/report';
import { DetailsProduct } from './layout/details-product/details-product';
import { Order } from './layout/order/order';
import { ProductResolver } from './core/resolvers/product-resolver'; 
import { ProductListDashboard } from './dashboard/product-list-dashboard/product-list-dashboard';

export const routes: Routes = [
    {
    path: '',
    component: Layout,
    children: [
      {path:'',redirectTo:'home',pathMatch:'full'},
      { path: 'home', component: Home },
      { path: 'product', component: Productlist },
      { path: 'faq', component: FAQ},
      { path: 'contact', component: Contact },
      { path: 'cart', component: Cart },
      { path: 'register', component: Register},
      { path: 'login', component: Login},
      { path: 'cart', component: Cart},
      { path: 'order', component: Order},
      { path: 'product/:route', component: DetailsProduct,resolve:{Product:ProductResolver}},
    
    ]
   },
   
   { path: 'profile', component: Profile},
 { path: 'dashboard', component: Dashboard, canActivate: [AdminGuard],children
        :[
            
            {path:'PindingOrders',component:PindingOrders},
            {path:'OrderList',component:OrdersList},
            {path:'TestimonialList',component:TestimonialList},
             {path:'Unseen-Testimonial',component:UnseenTestimonial},
            {path:'UnApprove-Testimonial',component:UnApproveTestimonial},
            {path:'FAQList',component:FAQList},
           {path:'ProductList-Dashboard',component:ProductListDashboard},
            {path:'ContactList',component:ContactList},
            {path:'report',component:Report}
         ]
        },
 { path: '**', redirectTo: 'home' },

];
