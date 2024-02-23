// eslint-disable-next-line
// @ts-nocheck

const BuyButtonComponent = ({
  clientRefId,
  customerEmail,
}: {
  buttonId: string;
  publishable_key: string;
  clientRefId: string;
  customerEmail: string;
}) => {
  // Paste the stripe-buy-button snippet in your React component
  return (
    <stripe-buy-button
      buy-button-id="buy_btn_1OmzklHMk6dSdO1wc8bCrq3x"
      publishable-key="pk_live_51MyR7yHMk6dSdO1wRRMC5xBE8tZ2TF39vygFOP7SGY37IpOcFNiE7SYKxPeFKmmBEmSSD55L2yiRfo3DidMPn0SG00TywaxKT3"
      client-reference-id={clientRefId}
      customer-email={customerEmail}
    ></stripe-buy-button>
  );
};

export default BuyButtonComponent;
