-- World Cup 2026 Nations (48 teams, 12 groups)

-- Group A
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('Mexico', 'MEX', '🇲🇽', 'A', 'CONCACAF'),
('Canada', 'CAN', '🇨🇦', 'A', 'CONCACAF'),
('TBD A3', 'TA3', '🏳️', 'A', 'TBD'),
('TBD A4', 'TA4', '🏳️', 'A', 'TBD');

-- Group B
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('United States', 'USA', '🇺🇸', 'B', 'CONCACAF'),
('TBD B2', 'TB2', '🏳️', 'B', 'TBD'),
('TBD B3', 'TB3', '🏳️', 'B', 'TBD'),
('TBD B4', 'TB4', '🏳️', 'B', 'TBD');

-- Group C
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('Argentina', 'ARG', '🇦🇷', 'C', 'CONMEBOL'),
('TBD C2', 'TC2', '🏳️', 'C', 'TBD'),
('TBD C3', 'TC3', '🏳️', 'C', 'TBD'),
('TBD C4', 'TC4', '🏳️', 'C', 'TBD');

-- Group D
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('Brazil', 'BRA', '🇧🇷', 'D', 'CONMEBOL'),
('TBD D2', 'TD2', '🏳️', 'D', 'TBD'),
('TBD D3', 'TD3', '🏳️', 'D', 'TBD'),
('TBD D4', 'TD4', '🏳️', 'D', 'TBD');

-- Group E
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('France', 'FRA', '🇫🇷', 'E', 'UEFA'),
('TBD E2', 'TE2', '🏳️', 'E', 'TBD'),
('TBD E3', 'TE3', '🏳️', 'E', 'TBD'),
('TBD E4', 'TE4', '🏳️', 'E', 'TBD');

-- Group F
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('Germany', 'GER', '🇩🇪', 'F', 'UEFA'),
('TBD F2', 'TF2', '🏳️', 'F', 'TBD'),
('TBD F3', 'TF3', '🏳️', 'F', 'TBD'),
('TBD F4', 'TF4', '🏳️', 'F', 'TBD');

-- Group G
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('England', 'ENG', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'G', 'UEFA'),
('TBD G2', 'TG2', '🏳️', 'G', 'TBD'),
('TBD G3', 'TG3', '🏳️', 'G', 'TBD'),
('TBD G4', 'TG4', '🏳️', 'G', 'TBD');

-- Group H
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('Spain', 'ESP', '🇪🇸', 'H', 'UEFA'),
('TBD H2', 'TH2', '🏳️', 'H', 'TBD'),
('TBD H3', 'TH3', '🏳️', 'H', 'TBD'),
('TBD H4', 'TH4', '🏳️', 'H', 'TBD');

-- Group I
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('Portugal', 'POR', '🇵🇹', 'I', 'UEFA'),
('TBD I2', 'TI2', '🏳️', 'I', 'TBD'),
('TBD I3', 'TI3', '🏳️', 'I', 'TBD'),
('TBD I4', 'TI4', '🏳️', 'I', 'TBD');

-- Group J
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('Netherlands', 'NED', '🇳🇱', 'J', 'UEFA'),
('TBD J2', 'TJ2', '🏳️', 'J', 'TBD'),
('TBD J3', 'TJ3', '🏳️', 'J', 'TBD'),
('TBD J4', 'TJ4', '🏳️', 'J', 'TBD');

-- Group K
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('Italy', 'ITA', '🇮🇹', 'K', 'UEFA'),
('TBD K2', 'TK2', '🏳️', 'K', 'TBD'),
('TBD K3', 'TK3', '🏳️', 'K', 'TBD'),
('TBD K4', 'TK4', '🏳️', 'K', 'TBD');

-- Group L
INSERT INTO nations (name, code, flag, group_name, confederation) VALUES
('Japan', 'JPN', '🇯🇵', 'L', 'AFC'),
('TBD L2', 'TL2', '🏳️', 'L', 'TBD'),
('TBD L3', 'TL3', '🏳️', 'L', 'TBD'),
('TBD L4', 'TL4', '🏳️', 'L', 'TBD');

-- Sample opening matches
DO $$
DECLARE
  mexico_id UUID;
  canada_id UUID;
  usa_id UUID;
  brazil_id UUID;
  argentina_id UUID;
  france_id UUID;
  germany_id UUID;
  england_id UUID;
BEGIN
  SELECT id INTO mexico_id FROM nations WHERE code = 'MEX';
  SELECT id INTO canada_id FROM nations WHERE code = 'CAN';
  SELECT id INTO usa_id FROM nations WHERE code = 'USA';
  SELECT id INTO brazil_id FROM nations WHERE code = 'BRA';
  SELECT id INTO argentina_id FROM nations WHERE code = 'ARG';
  SELECT id INTO france_id FROM nations WHERE code = 'FRA';
  SELECT id INTO germany_id FROM nations WHERE code = 'GER';
  SELECT id INTO england_id FROM nations WHERE code = 'ENG';

  INSERT INTO matches (match_number, home_team_id, away_team_id, date, stage, group_name, venue, city) VALUES
    (1, mexico_id, canada_id, '2026-06-11 18:00:00+00', 'group', 'A', 'Estadio Azteca', 'Mexico City'),
    (2, usa_id, mexico_id, '2026-06-12 21:00:00+00', 'group', 'B', 'MetLife Stadium', 'New Jersey'),
    (3, brazil_id, argentina_id, '2026-06-13 18:00:00+00', 'group', 'D', 'AT&T Stadium', 'Dallas'),
    (4, france_id, germany_id, '2026-06-14 15:00:00+00', 'group', 'E', 'SoFi Stadium', 'Los Angeles'),
    (5, england_id, brazil_id, '2026-06-15 18:00:00+00', 'group', 'G', 'MetLife Stadium', 'New Jersey');
END $$;
