CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('athlete', 'organizer')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS athletes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  idade INTEGER NOT NULL,
  posicao TEXT NOT NULL,
  cidade TEXT,
  altura NUMERIC,
  peso NUMERIC,
  estatisticas JSONB,
  habilidades JSONB,
  videos JSONB,
  status TEXT,
  contatos JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  organizer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_evento DATE NOT NULL,
  local TEXT NOT NULL,
  requisitos TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  athlete_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
