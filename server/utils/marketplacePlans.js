export const MARKETPLACE_FREE_LIMIT = 2;

export const MARKETPLACE_PASS_PLANS = [
  {
    id: 'single-product',
    name: 'Single Product Pass',
    price: 12,
    amount: 1200,
    passes: 1,
    label: 'Add 1 more product'
  },
  {
    id: 'triple-product',
    name: 'Triple Product Pass',
    price: 35,
    amount: 3500,
    passes: 3,
    label: 'Add 3 more products'
  },
  {
    id: 'five-product',
    name: 'Five Product Pass',
    price: 50,
    amount: 5000,
    passes: 5,
    label: 'Add 5 more products'
  }
];

export const getMarketplacePassPlan = (planId) =>
  MARKETPLACE_PASS_PLANS.find((plan) => plan.id === planId);

export const getPublicMarketplacePassPlans = () =>
  MARKETPLACE_PASS_PLANS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.price,
    amount: plan.amount,
    passes: plan.passes,
    label: plan.label
  }));
