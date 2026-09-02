import { useState } from 'react';
import { Settings, DollarSign, Tag, Truck, Wallet, TrendingDown, Package } from 'lucide-react';

/**
 * Company Control Panel Component
 * 
 * Allows merchants to input their product and pricing data
 * to test OfferMatrix intelligence components.
 * 
 * Props:
 * - onDataSubmit: callback function when form is submitted
 * - brandColor: primary color for the merchant brand
 * - companyName: name of the merchant company
 */

const CompanyControlPanel = ({ 
  onDataSubmit,
  brandColor = '#D4527A',
  companyName = 'Merchant'
}) => {
  const [formData, setFormData] = useState({
    productName: '',
    brandName: '',
    originalPrice: '',
    salePrice: '',
    storeDiscount: '',
    couponCode: '',
    couponDiscount: '',
    shippingCost: '',
    bkashCashback: '',
    nagadCashback: '',
    category: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string numbers to actual numbers
    const processedData = {
      ...formData,
      originalPrice: parseFloat(formData.originalPrice) || 0,
      salePrice: parseFloat(formData.salePrice) || 0,
      storeDiscount: parseFloat(formData.storeDiscount) || 0,
      couponDiscount: parseFloat(formData.couponDiscount) || 0,
      shippingCost: parseFloat(formData.shippingCost) || 0,
      bkashCashback: parseFloat(formData.bkashCashback) || 0,
      nagadCashback: parseFloat(formData.nagadCashback) || 0,
    };

    setIsSubmitted(true);
    if (onDataSubmit) {
      onDataSubmit(processedData);
    }
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      brandName: '',
      originalPrice: '',
      salePrice: '',
      storeDiscount: '',
      couponCode: '',
      couponDiscount: '',
      shippingCost: '',
      bkashCashback: '',
      nagadCashback: '',
      category: '',
    });
    setIsSubmitted(false);
    if (onDataSubmit) {
      onDataSubmit(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="px-6 py-4 text-white flex items-center gap-3"
        style={{ backgroundColor: brandColor }}
      >
        <Settings className="w-6 h-6" />
        <div>
          <h3 className="text-lg font-bold">
            {companyName} Control Panel
          </h3>
          <p className="text-sm opacity-90">
            Input your product data to see OfferMatrix analysis
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Product Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Package className="w-4 h-4" style={{ color: brandColor }} />
              Product Information
            </h4>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="e.g., Hydrating Facial Cleanser"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Brand Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                placeholder="e.g., CeraVe"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Skincare"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
              <DollarSign className="w-4 h-4" style={{ color: brandColor }} />
              Pricing Details
            </h4>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Original Price (৳)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="e.g., 1500"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Sale Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sale Price (৳)
              </label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
                placeholder="e.g., 1200"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Store Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Store Discount (%)
              </label>
              <input
                type="number"
                name="storeDiscount"
                value={formData.storeDiscount}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                min="0"
                max="100"
                step="0.01"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Coupon & Shipping */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Tag className="w-4 h-4" style={{ color: brandColor }} />
              Coupon & Shipping
            </h4>

            {/* Coupon Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleInputChange}
                placeholder="e.g., SAVE10"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors uppercase"
              />
            </div>

            {/* Coupon Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Coupon Discount (৳)
              </label>
              <input
                type="number"
                name="couponDiscount"
                value={formData.couponDiscount}
                onChange={handleInputChange}
                placeholder="e.g., 120"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Shipping Cost */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Shipping Cost (৳)
              </label>
              <input
                type="number"
                name="shippingCost"
                value={formData.shippingCost}
                onChange={handleInputChange}
                placeholder="e.g., 0 or 60"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Cashback Options */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
              <Wallet className="w-4 h-4" style={{ color: brandColor }} />
              Cashback Options
            </h4>

            {/* bKash Cashback */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <span className="text-lg">📱</span>
                bKash Cashback (৳)
              </label>
              <input
                type="number"
                name="bkashCashback"
                value={formData.bkashCashback}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Nagad Cashback */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <span className="text-lg">💚</span>
                Nagad Cashback (৳)
              </label>
              <input
                type="number"
                name="nagadCashback"
                value={formData.nagadCashback}
                onChange={handleInputChange}
                placeholder="e.g., 60"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity shadow-md"
            style={{ backgroundColor: brandColor }}
          >
            {isSubmitted ? 'Update Analysis' : 'Generate OfferMatrix Analysis'}
          </button>
          
          {isSubmitted && (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium text-center">
              ✓ Data submitted successfully! Scroll down to see OfferMatrix analysis.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyControlPanel;
