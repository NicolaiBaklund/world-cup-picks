-- Shared trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Nations: countries participating in the World Cup
CREATE TABLE nations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code CHAR(3) NOT NULL UNIQUE,
  flag TEXT,
  group_name CHAR(1),
  confederation TEXT,

  played INT DEFAULT 0,
  won INT DEFAULT 0,
  drawn INT DEFAULT 0,
  lost INT DEFAULT 0,
  goals_for INT DEFAULT 0,
  goals_against INT DEFAULT 0,
  points INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nations_group ON nations(group_name);
CREATE INDEX idx_nations_code ON nations(code);

CREATE TRIGGER nations_updated_at
  BEFORE UPDATE ON nations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE nations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nations are viewable by everyone"
  ON nations FOR SELECT USING (true);
