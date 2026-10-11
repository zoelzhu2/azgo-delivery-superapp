# Nusantara Delivery & Logistics SuperApp (Decoupled Architecture)

Platform terpadu untuk **Ekspedisi Paket Antar-Kota (Model Hub-and-Spoke J&T)**, **Ojek/Taksi Online (Ride Hailing)**, dan **Pesan Antar Makanan (Food Delivery)** yang dibangun dengan prinsip **Clean & Decoupled Architecture**.

---

## 🎯 Mengapa Arsitektur Ini Terpisah & Aman dari Kerusakan?

1. **Client-Server Decoupling:**
   * Backend (`apps/api`) dan Frontend (`apps/web`) terpisah secara mandiri. Backend murni mengekspos REST API JSON.
   * *Manfaat:* Jika ingin membuat aplikasi Android/iOS (React Native atau Flutter) di kemudian hari, backend tidak perlu diubah sama sekali.

2. **Feature-Based Module Isolation:**
   * Setiap layanan berada di direktori modul masing-masing:
     * `modules/expedition/` (J&T Logistics: Hitung Volumetrik, Generator Resi AWB, Checkpoints, Hubs)
     * `modules/ride/` (Ojek & Taksi: Tarif per KM)
     * `modules/food/` (Resto, Menu, Food Ordering)
   * *Manfaat:* Kendala kode atau perubahan tarif di modul ekspedisi J&T **tidak akan pernah merusak atau mematikan layanan Ojek atau Makanan**.

3. **Lapisan 3-Tier di Tiap Modul:**
   * `*.controller.ts`: Hanya menangani HTTP Request/Response.
   * `*.service.ts`: Khusus logika bisnis murni (rumus volumetrik, tarif, nomor resi).
   * `*.repository.ts`: Khusus interaksi basis data.
   * *Manfaat:* Penggantian database dari memory ke PostgreSQL tidak akan merusak rumus bisnis di service.

4. **Shared Types Package (`@delivery/shared`):**
   * Kontrak DTOs dan Interface TypeScript didefinisikan satu kali di `packages/shared` dan diimpor bersama oleh Frontend dan Backend, mencegah kesalahan tipe data (*type mismatch*).

---

## 📁 Struktur Monorepo

```text
delivery-superapp/
├── packages/
│   └── shared/                   # Kontrak data TypeScript bersama (@delivery/shared)
│       └── src/types/            # order.ts, expedition.ts, user.ts, pricing.ts
├── apps/
│   ├── api/                      # Backend REST API (Node.js + Express + TS)
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── expedition/   # J&T Model: Controller, Service, Repository, Routes
│   │       │   ├── ride/         # Ride Hailing: Controller, Service, Routes
│   │       │   └── food/         # Food Delivery: Service, Routes
│   │       ├── app.ts
│   │       └── server.ts
│   └── web/                      # Frontend App (React + Vite + Tailwind CSS)
│       └── src/
│           ├── features/         # UI dipisah per fitur (expedition, ride, food)
│           ├── services/         # API Client layer
│           └── components/       # Reusable UI Navbar & layout
└── package.json                  # Root npm workspaces
```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Install Dependencies
Jalankan dari root folder `d:/Zhu/Delivery`:
```bash
npm install
```

### 2. Jalankan Backend API
```bash
npm run dev:api
```
Backend akan berjalan di `http://localhost:4000`.

### 3. Jalankan Frontend Web
```bash
npm run dev:web
```
Aplikasi web akan berjalan di `http://localhost:3000` dengan integrasi proxy otomatis ke backend.
