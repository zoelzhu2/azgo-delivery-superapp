import { createApp } from './app';

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 [Backend API] Berjalan di http://localhost:${PORT}`);
  console.log(`📦 [Modul Ekspedisi J&T] Mounted at /api/expedition`);
  console.log(`🛵 [Modul Ride Hailing] Mounted at /api/ride`);
  console.log(`🍔 [Modul Food Delivery] Mounted at /api/food`);
});
