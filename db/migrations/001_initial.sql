CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TYPE data_mode AS ENUM ('VERIFIED', 'DEMO', 'ARCHIVED');
CREATE TYPE admin_level AS ENUM ('STATE', 'DISTRICT', 'TALUKA', 'VILLAGE', 'GRAM_PANCHAYAT');

CREATE TABLE geographic_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lgd_code text NOT NULL UNIQUE,
  level admin_level NOT NULL,
  parent_id uuid REFERENCES geographic_units(id),
  name_en text NOT NULL,
  name_gu text,
  boundary geometry(MultiPolygon, 4326),
  population bigint CHECK (population IS NULL OR population >= 0),
  population_reference_year integer,
  source_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX geographic_units_parent_level_idx ON geographic_units(parent_id, level);
CREATE INDEX geographic_units_boundary_idx ON geographic_units USING gist(boundary);

CREATE TABLE data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text,
  licence text,
  verification_status text NOT NULL DEFAULT 'PENDING',
  retrieved_at timestamptz,
  content_sha256 text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE geographic_units ADD CONSTRAINT geographic_units_source_fk FOREIGN KEY (source_id) REFERENCES data_sources(id);

CREATE TABLE schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_en text NOT NULL,
  name_gu text,
  department text,
  official_url text,
  verification_status text NOT NULL DEFAULT 'PENDING',
  active boolean NOT NULL DEFAULT false,
  source_id uuid REFERENCES data_sources(id)
);

CREATE TABLE published_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES geographic_units(id),
  scheme_id uuid NOT NULL REFERENCES schemes(id),
  financial_year text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  data_mode data_mode NOT NULL,
  applications bigint CHECK (applications IS NULL OR applications >= 0),
  approved bigint CHECK (approved IS NULL OR approved >= 0),
  pending bigint CHECK (pending IS NULL OR pending >= 0),
  rejected bigint CHECK (rejected IS NULL OR rejected >= 0),
  beneficiaries bigint CHECK (beneficiaries IS NULL OR beneficiaries >= 0),
  amount_sanctioned numeric(18,2),
  amount_disbursed numeric(18,2),
  currency text NOT NULL DEFAULT 'INR',
  source_id uuid NOT NULL REFERENCES data_sources(id),
  data_as_of date NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(unit_id, scheme_id, financial_year, period_start, period_end, data_mode)
);

CREATE TABLE import_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  sha256 text NOT NULL,
  data_mode data_mode NOT NULL,
  status text NOT NULL DEFAULT 'RECEIVED',
  validation_summary jsonb,
  uploaded_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id bigserial PRIMARY KEY,
  actor_id text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  request_id text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
