import './ReceiptModal.css';

const ReceiptModal = ({ isOpen, onClose, receipt }) => {
  if (!isOpen || !receipt) return null;

  const formattedDate = new Date(receipt.timestamp).toLocaleString();

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="receipt-modal">
        <div className="receipt-header">
          <div className="success-icon">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>Order Successful!</h2>
          <p>Thank you for your purchase</p>
        </div>

        <div className="receipt-content">
          <div className="receipt-info">
            <div className="info-row">
              <span className="info-label">Order ID:</span>
              <span className="info-value">{receipt.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date:</span>
              <span className="info-value">{formattedDate}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{receipt.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{receipt.email}</span>
            </div>
          </div>

          {receipt.items && receipt.items.length > 0 && (
            <div className="receipt-items">
              <h3>Items Ordered</h3>
              {receipt.items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}

          <div className="receipt-total">
            <span>Total Amount:</span>
            <span className="total-amount">₹{receipt.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="receipt-footer">
          <button className="close-receipt-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
};

export default ReceiptModal;
