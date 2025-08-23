import { Router } from 'express';
import { handleGetAllCheckoutsByUserId } from '../controllers/CheckoutController';

const checkoutRouter = Router();

checkoutRouter.get('/', handleGetAllCheckoutsByUserId);

export default checkoutRouter;
