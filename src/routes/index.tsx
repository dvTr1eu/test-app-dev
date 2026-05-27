import { createBrowserRouter } from 'react-router-dom';
import DiscountPage from '../features/volume-discount/pages/DiscountPage';

export const router = createBrowserRouter([
    {
        path: '/DiscountPage',
        element: <DiscountPage />,
    },
]);
