INSERT INTO FicoCategory (id, name, type, isCustom, createdAt, updatedAt) VALUES
  -- Wpłaty bankowe
  (UUID(), 'Wpłata na konto', 'INCOME', false, NOW(), NOW()),
  (UUID(), 'Wypłata z konta', 'EXPENSE', false, NOW(), NOW()),

  -- Rozbicie wpływów
  (UUID(), 'Dotacja z naczelnictwa', 'INCOME', false, NOW(), NOW()),
  (UUID(), 'Dotacja MEiN', 'INCOME', false, NOW(), NOW()),
  (UUID(), 'Dotacja samorządowa', 'INCOME', false, NOW(), NOW()),
  (UUID(), 'Wpływy z akcji zarobkowych', 'INCOME', false, NOW(), NOW()),
  (UUID(), 'Składka uczestnika', 'INCOME', false, NOW(), NOW()),
  (UUID(), 'Darowizna prywatna', 'INCOME', false, NOW(), NOW()),
  (UUID(), 'Darowizna organizacji', 'INCOME', false, NOW(), NOW()),
  (UUID(), '1% podatku', 'INCOME', false, NOW(), NOW()),
  (UUID(), 'Inne wpływy', 'INCOME', false, NOW(), NOW()),

  -- Rozbicie wydatków
  (UUID(), 'Wyposażenie', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Materiały', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Sprzątanie', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Pozostałe materiały', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Energia', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Telefon', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Czynsz / Najem', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Poczta', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Koszty bankowe', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Kurier', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Usługi', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Wynagrodzenia', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Ubezpieczenie OC', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Ubezpieczenie NNW', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Podróże / Dojazdy', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Wyżywienie', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Nagrody / Upominki', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Bilety', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Zakwaterowanie', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Transport', 'EXPENSE', false, NOW(), NOW()),
  (UUID(), 'Inne wydatki', 'EXPENSE', false, NOW(), NOW());
