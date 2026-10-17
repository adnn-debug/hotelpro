import { useState } from "react";

// Luhn check: the standard way card numbers catch typing mistakes
function isValidCardNumber(number) {
  const digits = number.replace(/\s/g, "");
  if (!/^\d{16}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let d = Number(digits[15 - i]); // walk from the last digit backwards
    if (i % 2 === 1) {
      d *= 2; // double every second digit
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

// Expiry must look like MM/YY and must not be in the past
function isValidExpiry(value) {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  // A card works until the last day of its expiry month
  return new Date(year, month, 0, 23, 59, 59) >= new Date();
}

function PaymentModal({ room, fromdate, todate, onClose, onPaid }) {
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const nights = Math.ceil(
    (new Date(todate) - new Date(fromdate)) / (1000 * 60 * 60 * 24)
  );
  const total = nights * room.rent;

  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!card.name.trim()) return setError("Enter the cardholder name");
    if (!isValidCardNumber(card.number)) return setError("Card number is not valid");
    if (!isValidExpiry(card.expiry)) return setError("Expiry must be a future date as MM/YY");
    if (!/^\d{3}$/.test(card.cvv)) return setError("CVV must be 3 digits");

    setPaying(true);
    // Only the booking details go to the server. The card details stay in this form.
    await onPaid();
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Payment</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="alert alert-warning py-2">
                Demo only. Do not enter a real card. Test number: 4242 4242 4242 4242
              </div>

              <p className="mb-3">
                <strong className="text-capitalize">{room.type} room #{room.roomNumber}</strong>
                <br />
                {nights} night(s) x Rs {room.rent} = <strong>Rs {total}</strong>
              </p>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <input className="form-control mb-3" name="name" placeholder="Cardholder name" value={card.name} onChange={handleChange} />
              <input className="form-control mb-3" name="number" placeholder="Card number" maxLength={19} value={card.number} onChange={handleChange} />
              <div className="row g-2">
                <div className="col">
                  <input className="form-control" name="expiry" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={handleChange} />
                </div>
                <div className="col">
                  <input className="form-control" name="cvv" type="password" placeholder="CVV" maxLength={3} value={card.cvv} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={paying}>
                {paying ? "Processing..." : `Pay Rs ${total}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;