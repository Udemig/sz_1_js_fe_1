import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import roomReducer from "./slice/roomSlice";

/* Slice kelime anlamı:  */

export const store = configureStore({
  reducer: {
    authState: authReducer,
    roomState: roomReducer,
  },
});

/* Normalde dispatch() fonksiyonunu useDispatch'ten alırız.
Bu gereksiz yere fazladan bir satır işgal eder. Bunun yerine
sotra.dispatch fonksiyonunu yeni bir isimle (appDispatch)
bu dosyadan export edebiliriz. Böylece fazladan hook çağırmaya
gerek kalmaz. */
export const appDispatch = store.dispatch;

/* State'imizin türünü otomatik olarka bulmasını sağlıyoruz. */
export type RootState = ReturnType<typeof store.getState>;

/* useDispatch() hook'undan dönen fonksiyonun türünü otomatik
olarak oluşturulmasını sağlıyoruz. Eğer bunu yapmazsak
dispatch() fonksiyonunu çağırırken problem yaşayabiliriz. */
export type AppDispatch = typeof store.dispatch;
