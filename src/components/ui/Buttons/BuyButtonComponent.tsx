// @ts-nocheck
import React from "react";


const BuyButtonComponent = ({buttonId,publishable_key,clientRefId,customerEmail}:{buttonId:string;publishable_key:string;clientRefId:string,customerEmail:string}) => {
  // Paste the stripe-buy-button snippet in your React component
  return (
    <stripe-buy-button
    // buy-button-id="buy_btn_1OSDlQAfze7OsrlF2L1XBG86"
    // publishable-key="pk_test_51ORGMMAfze7OsrlFNTMJifKHBm8B69cLJ5ORYtK2UBrxyV0Gkbqt2RuxpvzxJcKMoGmoUelXUVrCxE8K9or5wOlE000SctPe4q"
    
    buy-button-id={buttonId}
     publishable-key={publishable_key}
     client-reference-id={clientRefId}
     customer-email={customerEmail}
    ></stripe-buy-button>
  );
};

export default BuyButtonComponent;

