-- ============================================
-- NATIONS TABLE
-- Represents countries participating in the World Cup
-- ============================================

CREATE TABLE nations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code CHAR(3) NOT NULL UNIQUE,  -- ISO code: 'BRA', 'GER', etc.
  flag TEXT,                      -- Emoji or URL to flag image
  "group" CHAR(1),               -- World Cup group: 'A', 'B', etc.
  confederation TEXT,            -- UEFA, CONMEBOL, etc. (for future use)
  
  -- Statistics (updated as tournament progresses)
  played INT DEFAULT 0,
  won INT DEFAULT 0,
  drawn INT DEFAULT 0,
  lost INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  points INT DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by group
CREATE INDEX idx_nations_group ON nations("group");

-- Index for lookups by code
CREATE INDEX idx_nations_code ON nations(code);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nations_updated_at
  BEFORE UPDATE ON nations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Comments for documentation
COMMENT ON TABLE nations IS 'World Cup participating nations/teams';
COMMENT ON COLUMN nations.code IS 'FIFA country code (3 letters)';
COMMENT ON COLUMN nations.confederation IS 'Continental confederation: UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC';
