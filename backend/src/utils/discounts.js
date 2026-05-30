export const calculateDiscount = (user, guestProfile) => {
  if (user.role === 'GUEST_NEW' || guestProfile.isFirstVisit) {
    return 0.20;
  }
  
  if (user.role === 'GUEST_RETURNING' || guestProfile.totalStays > 0) {
    return 0.10;
  }
  
  return 0;
};

export const applyDiscount = (price, discountRate) => {
  const discount = price * discountRate;
  return {
    originalPrice: price,
    discount: discount,
    finalPrice: price - discount,
    discountRate: discountRate,
  };
};
