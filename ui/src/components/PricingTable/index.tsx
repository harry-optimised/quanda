import * as React from 'react';

const PUBLIC_KEY =
  'pk_live_51N5VPxH451kFmPn7JAQVIR675hpEfStlldWBnAXR65lBiKmjzaBjPxzNf66mRTJF0kEszgeU1tKsNgCyoFpQdDYr00ut80gmJK';
const PRICING_TABLE_ID = 'prctbl_1OUX7VH451kFmPn7SKAQrwa7';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

function PricingTable() {
  return <stripe-pricing-table pricing-table-id={PRICING_TABLE_ID} publishable-key={PUBLIC_KEY}></stripe-pricing-table>;
}

export default PricingTable;
