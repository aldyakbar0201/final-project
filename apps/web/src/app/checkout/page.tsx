export default function Checkout() {
  return (
    <>
      <section className="grid grid-cols-2">
        {/* TITLE */}
        <div>
          <h1>Delivery</h1>
          <h1>Payment</h1>
          <h1>Voucher</h1>
          <h1>Discount</h1>
          <h1>Total Cost</h1>
        </div>
        {/* VALUE */}
        <div>
          <h1>Select Method</h1>
          <h1>QRIS</h1>
          <h1>Pick discount</h1>
          <h1>$13.97</h1>
        </div>
      </section>
    </>
  );
}
