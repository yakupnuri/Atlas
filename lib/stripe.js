import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Frontend Stripe instance (client-side)
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.warn('Stripe publishable key not found');
      return null;
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
};

// Backend Stripe instance (server-side)
let stripeInstance;

export const getStripeInstance = () => {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      console.warn('Stripe secret key not found');
      return null;
    }
    
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }
  
  return stripeInstance;
};

// Helper to get Stripe instance from database settings
export const getStripeFromSettings = async (db) => {
  try {
    const settings = await db.collection('settings').findOne({ type: 'app_settings' });
    
    if (!settings?.apis?.stripe?.secretKey || !settings?.apis?.stripe?.enabled) {
      return null;
    }
    
    return new Stripe(settings.apis.stripe.secretKey, {
      apiVersion: '2023-10-16',
    });
  } catch (error) {
    console.error('Error getting Stripe from settings:', error);
    return null;
  }
};
