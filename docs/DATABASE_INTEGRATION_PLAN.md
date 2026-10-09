# Leghari Motors — Database & Cloud Storage Integration Plan

This document outlines the architecture for migrating **Leghari Motors** from the local mock repository to a production relational database (e.g., Supabase / PostgreSQL / Google Cloud SQL) and cloud media storage without rewriting UI components.

---

## 1. Clean Architecture & Repository Layer

All inventory and settings operations are decoupled through TypeScript interfaces defined in `/src/repositories/interfaces.ts`:

- `VehicleRepository`
- `BusinessSettingsRepository`
- `AuthenticationService`
- `MediaStorageService`

The UI consumes these contracts directly. To switch from browser `localStorage` mock data to a live database:
1. Implement the interface (e.g. `SupabaseVehicleRepository implements VehicleRepository`).
2. Export the instance in place of `MockVehicleRepository` in `/src/repositories/index.ts`.
3. The UI components will function identically without modification.

---

## 2. Production PostgreSQL Schema

```sql
-- 1. Vehicles Table
CREATE TABLE vehicles (
    id VARCHAR(64) PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    variant VARCHAR(150),
    year INT NOT NULL,
    price_pkr BIGINT NOT NULL,
    mileage_km INT NOT NULL DEFAULT 0,
    transmission VARCHAR(50) NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    engine_capacity_cc INT NOT NULL,
    exterior_color VARCHAR(100) NOT NULL,
    interior_color VARCHAR(100),
    body_type VARCHAR(50) NOT NULL,
    registration_city VARCHAR(100) NOT NULL,
    import_status VARCHAR(100) NOT NULL,
    condition VARCHAR(50) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    admin_notes TEXT, -- Private, excluded in public SELECT queries
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Vehicle Images Table
CREATE TABLE vehicle_images (
    id VARCHAR(64) PRIMARY KEY,
    vehicle_id VARCHAR(64) REFERENCES vehicles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    image_order INT NOT NULL DEFAULT 1,
    view_label VARCHAR(100) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Business Settings Table
CREATE TABLE business_settings (
    id INT PRIMARY KEY DEFAULT 1,
    showroom_name VARCHAR(200) NOT NULL DEFAULT 'Leghari Motors',
    owner_name VARCHAR(100) NOT NULL DEFAULT 'Shahid Leghari',
    city VARCHAR(100) NOT NULL DEFAULT 'Dera Ghazi Khan',
    province VARCHAR(100) NOT NULL DEFAULT 'Punjab',
    country VARCHAR(100) NOT NULL DEFAULT 'Pakistan',
    phone VARCHAR(50) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    google_maps_url TEXT NOT NULL,
    business_hours TEXT NOT NULL,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT
);

-- 4. Admin Users & RBAC
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL, -- 'shahidlegahrii'
    password_hash TEXT NOT NULL,
    display_name VARCHAR(150) NOT NULL DEFAULT 'Shahid Leghari',
    role VARCHAR(50) NOT NULL DEFAULT 'owner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 3. Cloud Storage Migration (`MediaStorageService`)

Replace Base64 data URLs with signed bucket uploads:
- Target bucket: `leghari-motors-showroom-media`
- Use thumbnail generation webhooks (e.g. sharp or Cloudflare Image Resizing)
- Verify that every vehicle upload has view labels (`Front Three-Quarter`, `Rear Three-Quarter`, `Cockpit`, etc.) and verified status flags.

---

## 4. Production Security & Server-Side Enforcement

- Exclude `admin_notes` from public endpoints:
  ```ts
  // In server-side queries:
  select('id, make, model, variant, year, price_pkr, ...') // Omit admin_notes
  ```
- Store password hashes with bcrypt/argon2 for `shahidlegahrii` on a secure authentication backend (Firebase Auth, Supabase Auth, or iron-session).
- Protect write operations (`INSERT`, `UPDATE`, `DELETE`) with role-based JWT validation verifying `role === 'owner'`.
