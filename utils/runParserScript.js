import {parseAddress} from '../index.js';

const addresses = [
   "11611 US Highway 431, Guntersville, AL 35976-5658",
   '57 US Highway 64 E., Plymouth, NC 27962',
   '57 US Highway 64E., Plymouth, NC 27962',
   '41934 NC Highway 12., Avon, NC 27915',
   '500 N U.S. Hwy 281, Marble Falls, TX 78654, USA',
   '858 US Highway 60 East, Republic, MO 65738-1525',
   '904 US Hwy 278, Amory, MS 38821, USA',
];

addresses.forEach((address) => {
   const res = parseAddress(address);
   console.log(`RAW => ${address}`);
   console.log('Parsed Address =>', res);
   const noonlight = res.format('NOONLIGHT');
   console.log('noonlight =>', noonlight);
   console.log('---');
});