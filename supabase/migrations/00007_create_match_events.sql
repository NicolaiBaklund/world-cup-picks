-- Match events: goals, cards, substitutions for live tracking
CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL
    CHECK (event_type IN ('goal', 'own_goal', 'penalty_goal', 'penalty_miss', 'yellow_card', 'red_card', 'substitution')),
  minute INT NOT NULL,
  player_name TEXT,
  team_id UUID REFERENCES nations(id),
  details JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_match_events_match ON match_events(match_id);
CREATE INDEX idx_match_events_type ON match_events(event_type);

ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match events are viewable by everyone"
  ON match_events FOR SELECT USING (true);

-- Enable realtime for live event updates
ALTER PUBLICATION supabase_realtime ADD TABLE match_events;
