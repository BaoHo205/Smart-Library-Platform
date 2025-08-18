import { Router } from 'express';
import { handleGetAllCheckoutsByUserId } from '../controllers/CheckoutController';

const checkoutRouter = Router();

checkoutRouter.get('/:userId', handleGetAllCheckoutsByUserId);

export default checkoutRouter;