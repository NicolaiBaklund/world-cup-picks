-- Editorial profile data for the 48 World Cup 2026 nations.
-- Re-runnable: matches existing rows by `code` (inserted by sync-teams).
-- Run AFTER sync-teams has populated nations. Not a numbered migration because
-- it depends on API-sourced rows existing first.
--
-- Heroes are fully replaced on each run.
DELETE FROM nation_heroes;

-- ---------- Group A ----------
UPDATE nations SET flag='🇲🇽', nickname='El Tri', fifa_ranking=14, home_stadium='Estadio Azteca', home_stadium_city='Mexico City', wc_appearances=18, wc_titles=0, best_finish='Quarter-finals (1970, 1986)', first_wc_year=1930,
  bio='Co-hosts and CONCACAF''s standard-bearers, present at every World Cup since 1994 and quarter-finalists twice on home soil.' WHERE code='MEX';
UPDATE nations SET flag='🇰🇷', nickname='Taegeuk Warriors', fifa_ranking=23, home_stadium='Seoul World Cup Stadium', home_stadium_city='Seoul', wc_appearances=12, wc_titles=0, best_finish='Fourth place (2002)', first_wc_year=1954,
  bio='Asia''s most consistent side, famed for their run to the semi-finals as co-hosts in 2002.' WHERE code='KOR';
UPDATE nations SET flag='🇿🇦', nickname='Bafana Bafana', fifa_ranking=60, home_stadium='FNB Stadium', home_stadium_city='Johannesburg', wc_appearances=4, wc_titles=0, best_finish='Group stage', first_wc_year=1998,
  bio='The first nation to host a World Cup on African soil, in 2010.' WHERE code='RSA';
UPDATE nations SET flag='🇨🇿', nickname='Národní tým', fifa_ranking=40, home_stadium='Fortuna Arena', home_stadium_city='Prague', wc_appearances=10, wc_titles=0, best_finish='Runners-up (1934, 1962, as Czechoslovakia)', first_wc_year=1934,
  bio='Heirs to the great Czechoslovakia sides and Euro 1996 finalists, known for technical midfielders.' WHERE code='CZE';

-- ---------- Group B ----------
UPDATE nations SET flag='🇨🇦', nickname='Les Rouges', fifa_ranking=30, home_stadium='BMO Field', home_stadium_city='Toronto', wc_appearances=3, wc_titles=0, best_finish='Group stage', first_wc_year=1986,
  bio='Co-hosts on the rise, blending pace and youth after ending a 36-year World Cup absence in 2022.' WHERE code='CAN';
UPDATE nations SET flag='🇶🇦', nickname='The Maroon', fifa_ranking=55, home_stadium='Lusail Stadium', home_stadium_city='Lusail', wc_appearances=1, wc_titles=0, best_finish='Group stage', first_wc_year=2022,
  bio='Asian champions in 2019 who debuted as hosts in 2022.' WHERE code='QAT';
UPDATE nations SET flag='🇨🇭', nickname='Nati', fifa_ranking=19, home_stadium='Stade de Genève', home_stadium_city='Geneva', wc_appearances=12, wc_titles=0, best_finish='Quarter-finals (1934, 1938, 1954)', first_wc_year=1934,
  bio='Reliable tournament regulars with a rock-solid defence and a knack for the knockout rounds.' WHERE code='SUI';
UPDATE nations SET flag='🇧🇦', nickname='Zmajevi (Dragons)', fifa_ranking=74, home_stadium='Bilino Polje', home_stadium_city='Zenica', wc_appearances=1, wc_titles=0, best_finish='Group stage', first_wc_year=2014,
  bio='A passionate footballing nation that reached its first World Cup in 2014.' WHERE code='BIH';

-- ---------- Group C ----------
UPDATE nations SET flag='🇧🇷', nickname='Seleção', fifa_ranking=5, home_stadium='Maracanã', home_stadium_city='Rio de Janeiro', wc_appearances=22, wc_titles=5, best_finish='Champions (1958, 1962, 1970, 1994, 2002)', first_wc_year=1930,
  bio='The only side to play in every World Cup and record five-time champions — the benchmark of the global game.' WHERE code='BRA';
UPDATE nations SET flag='🇭🇹', nickname='Les Grenadiers', fifa_ranking=85, home_stadium='Stade Sylvio Cator', home_stadium_city='Port-au-Prince', wc_appearances=2, wc_titles=0, best_finish='Group stage', first_wc_year=1974,
  bio='A Caribbean side returning to the World Cup stage for the first time since 1974.' WHERE code='HAI';
UPDATE nations SET flag='🏴󠁧󠁢󠁳󠁣󠁴󠁿', nickname='The Tartan Army', fifa_ranking=39, home_stadium='Hampden Park', home_stadium_city='Glasgow', wc_appearances=9, wc_titles=0, best_finish='Group stage', first_wc_year=1954,
  bio='One of football''s oldest nations, backed by the famously loyal Tartan Army.' WHERE code='SCO';
UPDATE nations SET flag='🇲🇦', nickname='Atlas Lions', fifa_ranking=12, home_stadium='Stade Mohammed V', home_stadium_city='Casablanca', wc_appearances=7, wc_titles=0, best_finish='Fourth place (2022)', first_wc_year=1970,
  bio='The first African and Arab side to reach a World Cup semi-final, in 2022.' WHERE code='MAR';

-- ---------- Group D ----------
UPDATE nations SET flag='🇺🇸', nickname='The Stars and Stripes', fifa_ranking=16, home_stadium='Q2 Stadium', home_stadium_city='Austin', wc_appearances=11, wc_titles=0, best_finish='Third place (1930)', first_wc_year=1930,
  bio='Co-hosts and a rapidly maturing side built around a generation playing in Europe''s top leagues.' WHERE code='USA';
UPDATE nations SET flag='🇦🇺', nickname='Socceroos', fifa_ranking=24, home_stadium='Stadium Australia', home_stadium_city='Sydney', wc_appearances=6, wc_titles=0, best_finish='Round of 16 (2006, 2022)', first_wc_year=1974,
  bio='Gritty and well-drilled, Australia have qualified for every World Cup since 2006.' WHERE code='AUS';
UPDATE nations SET flag='🇵🇾', nickname='La Albirroja', fifa_ranking=45, home_stadium='Estadio Defensores del Chaco', home_stadium_city='Asunción', wc_appearances=9, wc_titles=0, best_finish='Quarter-finals (2010)', first_wc_year=1930,
  bio='Combative South Americans famous for resolute defending and big-game upsets.' WHERE code='PAR';
UPDATE nations SET flag='🇹🇷', nickname='Ay-Yıldızlılar (Crescent-Stars)', fifa_ranking=27, home_stadium='Atatürk Olympic Stadium', home_stadium_city='Istanbul', wc_appearances=3, wc_titles=0, best_finish='Third place (2002)', first_wc_year=1954,
  bio='A vibrant footballing nation whose golden generation finished third in 2002.' WHERE code='TUR';

-- ---------- Group E ----------
UPDATE nations SET flag='🇨🇮', nickname='Les Éléphants', fifa_ranking=42, home_stadium='Stade Alassane Ouattara', home_stadium_city='Abidjan', wc_appearances=3, wc_titles=0, best_finish='Group stage', first_wc_year=2006,
  bio='Two-time African champions who count the great Didier Drogba among their legends.' WHERE code='CIV';
UPDATE nations SET flag='🇪🇨', nickname='La Tri', fifa_ranking=33, home_stadium='Estadio Rodrigo Paz Delgado', home_stadium_city='Quito', wc_appearances=4, wc_titles=0, best_finish='Round of 16 (2006)', first_wc_year=2002,
  bio='High-altitude specialists from the Andes with a fearless young squad.' WHERE code='ECU';
UPDATE nations SET flag='🇩🇪', nickname='Die Mannschaft', fifa_ranking=10, home_stadium='Allianz Arena', home_stadium_city='Munich', wc_appearances=20, wc_titles=4, best_finish='Champions (1954, 1974, 1990, 2014)', first_wc_year=1934,
  bio='Four-time world champions and the model of tournament efficiency over seven decades.' WHERE code='GER';
UPDATE nations SET flag='🇨🇼', nickname='Famia Korsou', fifa_ranking=82, home_stadium='Ergilio Hato Stadium', home_stadium_city='Willemstad', wc_appearances=1, wc_titles=0, best_finish='Debut', first_wc_year=2026,
  bio='A tiny Caribbean island making a historic first World Cup appearance in 2026.' WHERE code='CUW';

-- ---------- Group F ----------
UPDATE nations SET flag='🇳🇱', nickname='Oranje', fifa_ranking=7, home_stadium='Johan Cruyff Arena', home_stadium_city='Amsterdam', wc_appearances=11, wc_titles=0, best_finish='Runners-up (1974, 1978, 2010)', first_wc_year=1934,
  bio='Inventors of Total Football and three-time runners-up — the best side never to lift the trophy.' WHERE code='NED';
UPDATE nations SET flag='🇯🇵', nickname='Samurai Blue', fifa_ranking=18, home_stadium='Saitama Stadium 2002', home_stadium_city='Saitama', wc_appearances=8, wc_titles=0, best_finish='Round of 16 (2002, 2010, 2018, 2022)', first_wc_year=1998,
  bio='Disciplined and ever-improving, Japan have stunned Germany and Spain in recent tournaments.' WHERE code='JPN';
UPDATE nations SET flag='🇹🇳', nickname='Eagles of Carthage', fifa_ranking=41, home_stadium='Stade Olympique de Radès', home_stadium_city='Radès', wc_appearances=7, wc_titles=0, best_finish='Group stage', first_wc_year=1978,
  bio='North African regulars who recorded a famous win over France in 2022.' WHERE code='TUN';
UPDATE nations SET flag='🇸🇪', nickname='Blågult (Blue-Yellow)', fifa_ranking=37, home_stadium='Friends Arena', home_stadium_city='Stockholm', wc_appearances=12, wc_titles=0, best_finish='Runners-up (1958)', first_wc_year=1934,
  bio='Runners-up as hosts in 1958 and perennial Scandinavian over-achievers.' WHERE code='SWE';

-- ---------- Group G ----------
UPDATE nations SET flag='🇧🇪', nickname='Red Devils', fifa_ranking=8, home_stadium='King Baudouin Stadium', home_stadium_city='Brussels', wc_appearances=14, wc_titles=0, best_finish='Third place (2018)', first_wc_year=1930,
  bio='A golden generation finished third in 2018, the nation''s finest World Cup result.' WHERE code='BEL';
UPDATE nations SET flag='🇪🇬', nickname='The Pharaohs', fifa_ranking=35, home_stadium='Cairo International Stadium', home_stadium_city='Cairo', wc_appearances=4, wc_titles=0, best_finish='Group stage', first_wc_year=1934,
  bio='Record seven-time African champions, inspired by talisman Mohamed Salah.' WHERE code='EGY';
UPDATE nations SET flag='🇮🇷', nickname='Team Melli', fifa_ranking=20, home_stadium='Azadi Stadium', home_stadium_city='Tehran', wc_appearances=6, wc_titles=0, best_finish='Group stage', first_wc_year=1978,
  bio='One of Asia''s strongest sides, consistently among the continent''s top-ranked teams.' WHERE code='IRN';
UPDATE nations SET flag='🇳🇿', nickname='All Whites', fifa_ranking=89, home_stadium='Eden Park', home_stadium_city='Auckland', wc_appearances=3, wc_titles=0, best_finish='Group stage (unbeaten, 2010)', first_wc_year=1982,
  bio='Oceania''s flag-bearers, who went unbeaten in the 2010 group stage.' WHERE code='NZL';

-- ---------- Group H ----------
UPDATE nations SET flag='🇸🇦', nickname='The Green Falcons', fifa_ranking=56, home_stadium='King Fahd International Stadium', home_stadium_city='Riyadh', wc_appearances=7, wc_titles=0, best_finish='Round of 16 (1994)', first_wc_year=1994,
  bio='Asian giants who famously beat eventual champions Argentina in 2022.' WHERE code='KSA';
UPDATE nations SET flag='🇪🇸', nickname='La Roja', fifa_ranking=2, home_stadium='Santiago Bernabéu', home_stadium_city='Madrid', wc_appearances=16, wc_titles=1, best_finish='Champions (2010)', first_wc_year=1934,
  bio='World champions in 2010, masters of possession-based tiki-taka football.' WHERE code='ESP';
UPDATE nations SET flag='🇺🇾', nickname='La Celeste', fifa_ranking=15, home_stadium='Estadio Centenario', home_stadium_city='Montevideo', wc_appearances=14, wc_titles=2, best_finish='Champions (1930, 1950)', first_wc_year=1930,
  bio='Winners of the very first World Cup in 1930 and giants of South American football.' WHERE code='URU';
UPDATE nations SET flag='🇨🇻', nickname='Blue Sharks', fifa_ranking=70, home_stadium='Estádio Nacional', home_stadium_city='Praia', wc_appearances=1, wc_titles=0, best_finish='Debut', first_wc_year=2026,
  bio='An island nation of half a million making a fairytale first World Cup in 2026.' WHERE code='CPV';

-- ---------- Group I ----------
UPDATE nations SET flag='🇫🇷', nickname='Les Bleus', fifa_ranking=3, home_stadium='Stade de France', home_stadium_city='Saint-Denis', wc_appearances=17, wc_titles=2, best_finish='Champions (1998, 2018)', first_wc_year=1930,
  bio='Two-time and recent champions with arguably the deepest talent pool in world football.' WHERE code='FRA';
UPDATE nations SET flag='🇸🇳', nickname='Lions of Teranga', fifa_ranking=17, home_stadium='Stade Abdoulaye Wade', home_stadium_city='Dakar', wc_appearances=4, wc_titles=0, best_finish='Quarter-finals (2002)', first_wc_year=2002,
  bio='African champions in 2022 and quarter-finalists on their 2002 debut.' WHERE code='SEN';
UPDATE nations SET flag='🇳🇴', nickname='Løvene (The Lions)', fifa_ranking=29, home_stadium='Ullevaal Stadion', home_stadium_city='Oslo', wc_appearances=4, wc_titles=0, best_finish='Round of 16 (1998)', first_wc_year=1938,
  bio='Back among the elite after a long absence, spearheaded by superstar striker Erling Haaland.' WHERE code='NOR';
UPDATE nations SET flag='🇮🇶', nickname='Lions of Mesopotamia', fifa_ranking=58, home_stadium='Basra International Stadium', home_stadium_city='Basra', wc_appearances=2, wc_titles=0, best_finish='Group stage', first_wc_year=1986,
  bio='Asian Cup winners in 2007, a triumph that united a nation.' WHERE code='IRQ';

-- ---------- Group J ----------
UPDATE nations SET flag='🇦🇷', nickname='La Albiceleste', fifa_ranking=1, home_stadium='Estadio Monumental', home_stadium_city='Buenos Aires', wc_appearances=18, wc_titles=3, best_finish='Champions (1978, 1986, 2022)', first_wc_year=1930,
  bio='Reigning world champions, home of Maradona and Messi and a footballing obsession.' WHERE code='ARG';
UPDATE nations SET flag='🇩🇿', nickname='Les Fennecs (Desert Foxes)', fifa_ranking=43, home_stadium='Stade du 5 Juillet 1962', home_stadium_city='Algiers', wc_appearances=4, wc_titles=0, best_finish='Round of 16 (2014)', first_wc_year=1982,
  bio='African champions in 2019, with a proud World Cup history of giant-killing.' WHERE code='ALG';
UPDATE nations SET flag='🇦🇹', nickname='Das Team', fifa_ranking=25, home_stadium='Ernst-Happel-Stadion', home_stadium_city='Vienna', wc_appearances=8, wc_titles=0, best_finish='Third place (1954)', first_wc_year=1934,
  bio='Heirs to the legendary 1930s Wunderteam, back among Europe''s competitive sides.' WHERE code='AUT';
UPDATE nations SET flag='🇯🇴', nickname='Al-Nashama (The Chivalrous)', fifa_ranking=64, home_stadium='Amman International Stadium', home_stadium_city='Amman', wc_appearances=1, wc_titles=0, best_finish='Debut', first_wc_year=2026,
  bio='Asian Cup runners-up in 2023, reaching their first ever World Cup in 2026.' WHERE code='JOR';

-- ---------- Group K ----------
UPDATE nations SET flag='🇵🇹', nickname='A Seleção das Quinas', fifa_ranking=6, home_stadium='Estádio da Luz', home_stadium_city='Lisbon', wc_appearances=8, wc_titles=0, best_finish='Third place (1966)', first_wc_year=1966,
  bio='European champions in 2016, blending Cristiano Ronaldo''s legacy with a gifted new wave.' WHERE code='POR';
UPDATE nations SET flag='🇺🇿', nickname='White Wolves', fifa_ranking=57, home_stadium='Milliy Stadium', home_stadium_city='Tashkent', wc_appearances=1, wc_titles=0, best_finish='Debut', first_wc_year=2026,
  bio='Central Asian trailblazers qualifying for their first World Cup in 2026.' WHERE code='UZB';
UPDATE nations SET flag='🇨🇴', nickname='Los Cafeteros', fifa_ranking=13, home_stadium='Estadio Metropolitano', home_stadium_city='Barranquilla', wc_appearances=7, wc_titles=0, best_finish='Quarter-finals (2014)', first_wc_year=1962,
  bio='Flair-filled South Americans who lit up 2014 behind James Rodríguez.' WHERE code='COL';
UPDATE nations SET flag='🇨🇩', nickname='Léopards', fifa_ranking=59, home_stadium='Stade des Martyrs', home_stadium_city='Kinshasa', wc_appearances=2, wc_titles=0, best_finish='Group stage (1974, as Zaire)', first_wc_year=1974,
  bio='Two-time African champions returning to the World Cup after five decades.' WHERE code='COD';

-- ---------- Group L ----------
UPDATE nations SET flag='🇬🇭', nickname='Black Stars', fifa_ranking=68, home_stadium='Accra Sports Stadium', home_stadium_city='Accra', wc_appearances=5, wc_titles=0, best_finish='Quarter-finals (2010)', first_wc_year=2006,
  bio='Africa''s 2010 heartbreak side, who came within a penalty of the semi-finals.' WHERE code='GHA';
UPDATE nations SET flag='🇵🇦', nickname='La Marea Roja (Red Tide)', fifa_ranking=44, home_stadium='Estadio Rommel Fernández', home_stadium_city='Panama City', wc_appearances=2, wc_titles=0, best_finish='Group stage', first_wc_year=2018,
  bio='CONCACAF up-and-comers who reached their maiden World Cup in 2018.' WHERE code='PAN';
UPDATE nations SET flag='🏴󠁧󠁢󠁥󠁮󠁧󠁿', nickname='The Three Lions', fifa_ranking=4, home_stadium='Wembley Stadium', home_stadium_city='London', wc_appearances=17, wc_titles=1, best_finish='Champions (1966)', first_wc_year=1950,
  bio='The 1966 world champions and game''s birthplace, perennial contenders once more.' WHERE code='ENG';
UPDATE nations SET flag='🇭🇷', nickname='Vatreni (The Blazers)', fifa_ranking=9, home_stadium='Stadion Maksimir', home_stadium_city='Zagreb', wc_appearances=6, wc_titles=0, best_finish='Runners-up (2018)', first_wc_year=1998,
  bio='A small nation punching far above its weight — finalists in 2018 and third in 2022.' WHERE code='CRO';

-- ---------- Heroes (1-2 per nation) ----------
INSERT INTO nation_heroes (nation_id, name, position, years_active, description, sort_order)
SELECT n.id, h.name, h.position, h.years, h.descr, h.ord
FROM nations n
JOIN (VALUES
  ('MEX','Hugo Sánchez','Forward','1977–1998','Acrobatic goal-machine, one of the greatest strikers of his era.',0),
  ('MEX','Rafael Márquez','Defender','1997–2018','Elegant captain who appeared at five World Cups.',1),
  ('KOR','Son Heung-min','Forward','2010–present','Tottenham superstar and the face of Korean football.',0),
  ('KOR','Park Ji-sung','Midfielder','2000–2011','Tireless engine of the 2002 semi-final run, later a Manchester United mainstay.',1),
  ('RSA','Lucas Radebe','Defender','1992–2003','Leeds United captain and revered national leader.',0),
  ('CZE','Pavel Nedvěd','Midfielder','1994–2009','Tireless playmaker who won the 2003 Ballon d''Or.',0),
  ('CZE','Petr Čech','Goalkeeper','2002–2016','Commanding keeper and one of the Premier League''s finest.',1),
  ('CAN','Alphonso Davies','Defender','2018–present','Explosive Bayern Munich full-back and national talisman.',0),
  ('QAT','Akram Afif','Forward','2015–present','Creative star and two-time Asian Cup top performer.',0),
  ('SUI','Granit Xhaka','Midfielder','2011–present','Combative, long-serving captain and midfield metronome.',0),
  ('BIH','Edin Džeko','Forward','2007–present','Prolific striker and the nation''s record goalscorer.',0),
  ('BRA','Pelé','Forward','1957–1971','Three-time World Cup winner, regarded by many as the greatest of all time.',0),
  ('BRA','Ronaldo','Forward','1994–2011','El Fenómeno, the unstoppable striker of the 2002 triumph.',1),
  ('HAI','Joe Gaetjens','Forward','1950','Scored the winner in the USA''s 1950 shock over England.',0),
  ('SCO','Kenny Dalglish','Forward','1971–1986','Record cap-holder and a Liverpool and Celtic legend.',0),
  ('MAR','Achraf Hakimi','Defender','2016–present','Lightning full-back and leader of the 2022 semi-finalists.',0),
  ('USA','Landon Donovan','Forward','2000–2014','The USA''s talisman, scorer of the famous 2010 last-gasp winner.',0),
  ('USA','Christian Pulisic','Forward','2016–present','Captain America, the team''s creative spearhead.',1),
  ('AUS','Tim Cahill','Forward','2004–2018','The Socceroos'' record scorer and World Cup hero.',0),
  ('PAR','José Luis Chilavert','Goalkeeper','1989–2003','Free-kick-scoring keeper and fearsome competitor.',0),
  ('TUR','Hakan Şükür','Forward','1992–2007','Scored the fastest goal in World Cup history in 2002.',0),
  ('CIV','Didier Drogba','Forward','2002–2014','Talismanic striker and a continental icon on and off the pitch.',0),
  ('ECU','Antonio Valencia','Midfielder','2005–2020','Driving wide man and long-time Manchester United captain.',0),
  ('GER','Franz Beckenbauer','Defender','1965–1977','Der Kaiser, who won the World Cup as captain and coach.',0),
  ('GER','Miroslav Klose','Forward','2001–2014','The all-time leading World Cup goalscorer with 16.',1),
  ('CUW','Leandro Bacuna','Midfielder','2013–present','Experienced European-based leader of the island side.',0),
  ('NED','Johan Cruyff','Forward','1966–1977','The father of Total Football and a transformative genius.',0),
  ('NED','Marco van Basten','Forward','1981–1993','Sublime striker famed for his volleyed brilliance.',1),
  ('JPN','Hidetoshi Nakata','Midfielder','1997–2006','The pioneer who took Japanese football to Europe.',0),
  ('TUN','Wahbi Khazri','Forward','2013–2022','Mercurial forward and big-game scorer.',0),
  ('SWE','Zlatan Ibrahimović','Forward','2001–2023','Audacious, larger-than-life striker and the nation''s record scorer.',0),
  ('BEL','Eden Hazard','Forward','2008–2023','Mesmerising dribbler at the heart of the golden generation.',0),
  ('BEL','Kevin De Bruyne','Midfielder','2010–present','One of the finest playmakers of his generation.',1),
  ('EGY','Mohamed Salah','Forward','2011–present','Liverpool''s record-breaking forward and Egyptian icon.',0),
  ('IRN','Ali Daei','Forward','1993–2006','Former all-time leading international goalscorer.',0),
  ('NZL','Ryan Nelsen','Defender','1999–2012','Rugged centre-back and captain of the 2010 side.',0),
  ('KSA','Sami Al-Jaber','Forward','1992–2006','Four-time World Cup forward and Saudi great.',0),
  ('ESP','Andrés Iniesta','Midfielder','2006–2018','Scored the goal that won Spain the 2010 World Cup.',0),
  ('ESP','Xavi','Midfielder','2000–2014','The conductor of tiki-taka''s golden era.',1),
  ('URU','Luis Suárez','Forward','2007–present','Ruthless, brilliant striker and modern Uruguayan great.',0),
  ('URU','Diego Forlán','Forward','2002–2014','Golden Ball winner at the 2010 World Cup.',1),
  ('CPV','Ryan Mendes','Forward','2010–present','Versatile attacker and a leader of the Blue Sharks.',0),
  ('FRA','Zinedine Zidane','Midfielder','1994–2006','Artistic genius and match-winner of the 1998 final.',0),
  ('FRA','Kylian Mbappé','Forward','2017–present','Generational talent and a World Cup final hat-trick scorer.',1),
  ('SEN','Sadio Mané','Forward','2012–present','Electric forward and hero of the 2022 African title.',0),
  ('NOR','Erling Haaland','Forward','2019–present','Record-shattering goalscorer and one of the world''s best.',0),
  ('IRQ','Younis Mahmoud','Forward','2002–2016','Captain who headed the winner in the 2007 Asian Cup final.',0),
  ('ARG','Lionel Messi','Forward','2005–present','World Cup winner in 2022 and widely hailed as the greatest ever.',0),
  ('ARG','Diego Maradona','Forward','1977–1994','Inspirational genius who single-handedly drove the 1986 triumph.',1),
  ('ALG','Riyad Mahrez','Forward','2014–present','Silky winger and Premier League title-winner.',0),
  ('AUT','David Alaba','Defender','2009–present','Versatile, decorated defender and long-time captain.',0),
  ('JOR','Mousa Al-Tamari','Forward','2017–present','Pacy winger and the creative spark of the national team.',0),
  ('POR','Cristiano Ronaldo','Forward','2003–present','Five-time Ballon d''Or winner and his country''s record scorer.',0),
  ('POR','Eusébio','Forward','1961–1973','The Black Panther, top scorer at the 1966 World Cup.',1),
  ('UZB','Eldor Shomurodov','Forward','2017–present','European-based striker leading Uzbekistan''s debut generation.',0),
  ('COL','James Rodríguez','Midfielder','2011–present','Golden Boot winner at the 2014 World Cup.',0),
  ('COL','Carlos Valderrama','Midfielder','1985–1998','Iconic playmaker with unmistakable flair and hair.',1),
  ('COD','Cédric Bakambu','Forward','2015–present','Well-travelled goalscorer and Leopards leader.',0),
  ('GHA','Abedi Pelé','Midfielder','1982–1998','Three-time African Footballer of the Year.',0),
  ('GHA','Asamoah Gyan','Forward','2003–2019','The nation''s record scorer and 2010 World Cup hero.',1),
  ('PAN','Román Torres','Defender','2005–2019','Scored the goal that sent Panama to its first World Cup.',0),
  ('ENG','Bobby Moore','Defender','1962–1973','Composed captain who lifted the trophy in 1966.',0),
  ('ENG','Harry Kane','Forward','2015–present','England''s all-time leading goalscorer and captain.',1),
  ('CRO','Luka Modrić','Midfielder','2006–present','Ballon d''Or winner and orchestrator of two deep World Cup runs.',0),
  ('CRO','Davor Šuker','Forward','1991–2002','Golden Boot winner at the 1998 World Cup.',1)
) AS h(code, name, position, years, descr, ord) ON h.code = n.code;

-- Note: Congo DR / Croatia API codes are COD and CRO respectively.
