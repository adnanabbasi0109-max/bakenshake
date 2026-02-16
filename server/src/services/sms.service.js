const axios = require('axios');
const env = require('../config/env');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (phone, otp) => {
  if (env.NODE_ENV === 'development') {
    console.log(`[DEV] OTP for ${phone}: ${otp}`);
    return true;
  }

  try {
    const response = await axios.post(
      'https://control.msg91.com/api/v5/otp',
      {
        template_id: env.MSG91_TEMPLATE_ID,
        mobile: `91${phone}`,
        otp: otp,
      },
      {
        headers: {
          authkey: env.MSG91_AUTH_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.type === 'success';
  } catch (error) {
    console.error('SMS send error:', error.message);
    return false;
  }
};

module.exports = { generateOTP, sendOTP };
