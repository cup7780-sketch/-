export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { uid, coupons } = req.body;
  if (!uid || !Array.isArray(coupons)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const isValidCoupon = (code) => {
    const regex = /^[a-z0-9._-]{1,100}$/;
    return regex.test(code) && !code.includes('---');
  };

  const invalidCoupons = coupons.filter(coupon => !isValidCoupon(coupon));
  if (invalidCoupons.length > 0) {
    return res.status(400).json({ message: 'Invalid coupon codes', invalidCoupons });
  }

  const results = coupons.map(coupon => ({
    coupon,
    status: 'success',
    message: `쿠폰 ${coupon} 등록 완료`,
  }));

  res.status(200).json({ results });
}
