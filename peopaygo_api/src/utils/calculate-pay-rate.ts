import { PAY_TYPES } from "src/constants/pay_types";

export const calculatePayRate = (payType: PAY_TYPES, hours: number = 0) => {
  let rate = 0
  if (payType === PAY_TYPES.HOURLY) {
    rate = 12 * hours;
  } else {
    rate = 480;
  }
  return rate;
}