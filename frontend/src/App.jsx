import { useMemo, useState } from "react";

const athletes = [
  {
    id: 1,
    nome: "Ana Souza",
    idade: 22,
    posicao: "Atacante",
    cidade: "São Paulo",
    status: "Disponível",
    habilidades: ["Finalização", "Velocidade", "Marcação"],
    estatisticas: { gols: 12, assistencias: 7, jogos: 18 },
    videos: ["https://youtube.com/demo1"],
  },
  {
    id: 2,
    nome: "Mariana Costa",
    idade: 19,
    posicao: "Meio-campo",
    cidade: "Belo Horizonte",
    status: "Em avaliação",
    habilidades: ["Passe longo", "Visão de jogo", "Resistência"],
    estatisticas: { gols: 5, assistencias: 11, jogos: 20 },
    videos: ["https://youtube.com/demo2", "https://youtube.com/demo3"],
  },
  {
    id: 3,
    nome: "Luiza Ramos",
    idade: 24,
    posicao: "Zagueira",
    cidade: "Curitiba",
    status: "Disponível",
    habilidades: ["Antecipação", "Cabeceio", "Posicionamento"],
    estatisticas: { gols: 2, assistencias: 1, jogos: 22 },
    videos: [],
  },
];

const events = [
  {
    id: 1,
    titulo: "Peneira Nacional",
    data: "15 Mar 2025",
    local: "Rio de Janeiro",
    descricao: "Avaliação de atletas sub-23 com observadores internacionais.",
    requisitos: "Sub-23, experiência em campeonatos regionais.",
  },
  {
    id: 2,
    titulo: "Camp de Talentos",
    data: "02 Abr 2025",
    local: "Porto Alegre",
    descricao: "Semana de treinos intensivos para atletas femininas.",
    requisitos: "Atletas com disponibilidade integral.",
  },
];

const statsLabels = {
  gols: "Gols",
  assistencias: "Assistências",
  jogos: "Jogos",
};

const initialForm = {
  nome: "Ana Souza",
  idade: "22",
  posicao: "Atacante",
  cidade: "São Paulo",
  altura: "1.72",
  peso: "62",
  status: "Disponível",
  habilidades: "Finalização, Velocidade, Marcação",
  estatisticas: "Gols: 12, Assistências: 7, Jogos: 18",
  videos: "https://youtube.com/demo1",
};

export default function App() {
  const [filters, setFilters] = useState({ idade: "", posicao: "", cidade: "" });
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");

  const filteredAthletes = useMemo(() => {
    return athletes.filter((athlete) => {
      const idadeOk = filters.idade ? athlete.idade >= Number(filters.idade) : true;
      const posicaoOk = filters.posicao
        ? athlete.posicao.toLowerCase().includes(filters.posicao.toLowerCase())
        : true;
      const cidadeOk = filters.cidade
        ? athlete.cidade.toLowerCase().includes(filters.cidade.toLowerCase())
        : true;
      return idadeOk && posicaoOk && cidadeOk;
    });
  }, [filters]);

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.nome.trim()) nextErrors.nome = "Nome é obrigatório.";
    if (!formData.idade.trim()) nextErrors.idade = "Informe a idade.";
    if (!formData.posicao.trim()) nextErrors.posicao = "Informe a posição.";
    if (!formData.cidade.trim()) nextErrors.cidade = "Informe a cidade.";
    if (formData.videos && !formData.videos.includes("http")) {
      nextErrors.videos = "Informe um link válido para o vídeo.";
    }
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setFeedback("Perfil atualizado com sucesso!");
      setTimeout(() => setFeedback(""), 3000);
    } else {
      setFeedback("");
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <nav className="nav">
          <div className="logo">Fepipy</div>
          <div className="nav-actions">
            <button className="ghost">Entrar</button>
            <button className="primary">Criar conta</button>
          </div>
        </nav>
        <div className="hero-content">
          <div>
            <p className="eyebrow">Vitrine de Talentos</p>
            <h1>Conecte atletas e clubes com rapidez.</h1>
            <p className="subtitle">
              Busque atletas por posição, idade e cidade. Publique eventos e receba candidaturas em
              tempo real.
            </p>
          </div>
          <form className="search-card">
            <h3>Busca avançada</h3>
            <label>
              Idade mínima
              <input
                name="idade"
                type="number"
                placeholder="Ex: 18"
                value={filters.idade}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Posição
              <input
                name="posicao"
                placeholder="Ex: Atacante"
                value={filters.posicao}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              Cidade
              <input
                name="cidade"
                placeholder="Ex: Salvador"
                value={filters.cidade}
                onChange={handleFilterChange}
              />
            </label>
            <button type="button" className="primary">
              Aplicar filtros
            </button>
          </form>
        </div>
      </header>

      <section className="section">
        <div className="section-title">
          <div>
            <h2>Atletas em destaque</h2>
            <p>Resultados filtrados automaticamente conforme os critérios.</p>
          </div>
          <span className="badge">{filteredAthletes.length} encontrados</span>
        </div>
        <div className="grid">
          {filteredAthletes.map((athlete) => (
            <article className="card" key={athlete.id}>
              <div className="card-header">
                <div>
                  <h3>{athlete.nome}</h3>
                  <p>
                    {athlete.posicao} • {athlete.cidade}
                  </p>
                </div>
                <span className="status">{athlete.status}</span>
              </div>
              <div className="stats">
                {Object.entries(athlete.estatisticas).map(([key, value]) => (
                  <div key={key}>
                    <strong>{value}</strong>
                    <span>{statsLabels[key]}</span>
                  </div>
                ))}
              </div>
              <div className="tags">
                {athlete.habilidades.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
              <div className="card-footer">
                <span>{athlete.videos.length} vídeos</span>
                <button className="ghost">Ver perfil</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section muted">
        <div className="section-title">
          <div>
            <h2>Perfil do atleta</h2>
            <p>Edite informações, publique vídeos e acompanhe estatísticas.</p>
          </div>
        </div>
        <div className="profile">
          <div className="profile-overview">
            <div className="avatar">AS</div>
            <h3>{formData.nome}</h3>
            <p>
              {formData.posicao} • {formData.cidade}
            </p>
            <div className="profile-stats">
              <div>
                <strong>1.72m</strong>
                <span>Altura</span>
              </div>
              <div>
                <strong>62kg</strong>
                <span>Peso</span>
              </div>
              <div>
                <strong>{formData.status}</strong>
                <span>Status</span>
              </div>
            </div>
            <div className="profile-section">
              <h4>Vídeos</h4>
              <ul>
                <li>https://youtube.com/demo1</li>
                <li>https://youtube.com/demo3</li>
              </ul>
            </div>
            <div className="profile-section">
              <h4>Habilidades</h4>
              <div className="tags">
                <span>Finalização</span>
                <span>Velocidade</span>
                <span>Marcação</span>
              </div>
            </div>
          </div>
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Nome completo
                <input name="nome" value={formData.nome} onChange={handleFormChange} />
                {errors.nome && <span className="error">{errors.nome}</span>}
              </label>
              <label>
                Idade
                <input name="idade" value={formData.idade} onChange={handleFormChange} />
                {errors.idade && <span className="error">{errors.idade}</span>}
              </label>
            </div>
            <div className="form-row">
              <label>
                Posição
                <input name="posicao" value={formData.posicao} onChange={handleFormChange} />
                {errors.posicao && <span className="error">{errors.posicao}</span>}
              </label>
              <label>
                Cidade
                <input name="cidade" value={formData.cidade} onChange={handleFormChange} />
                {errors.cidade && <span className="error">{errors.cidade}</span>}
              </label>
            </div>
            <div className="form-row">
              <label>
                Habilidades (separe por vírgula)
                <input name="habilidades" value={formData.habilidades} onChange={handleFormChange} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Estatísticas
                <textarea
                  name="estatisticas"
                  rows="3"
                  value={formData.estatisticas}
                  onChange={handleFormChange}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Links de vídeos
                <input name="videos" value={formData.videos} onChange={handleFormChange} />
                {errors.videos && <span className="error">{errors.videos}</span>}
              </label>
            </div>
            <button type="submit" className="primary">
              Salvar perfil
            </button>
            {feedback && <p className="feedback">{feedback}</p>}
          </form>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <div>
            <h2>Eventos abertos</h2>
            <p>Crie eventos e receba candidaturas de atletas.</p>
          </div>
          <button className="ghost">Novo evento</button>
        </div>
        <div className="events">
          {events.map((event) => (
            <article className="event-card" key={event.id}>
              <div>
                <h3>{event.titulo}</h3>
                <p className="event-meta">
                  {event.data} • {event.local}
                </p>
                <p>{event.descricao}</p>
                <p className="event-req">Requisitos: {event.requisitos}</p>
              </div>
              <button className="primary">Candidatar-se</button>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>Fepipy</strong>
          <p>Plataforma de conexão entre talentos e organizações esportivas.</p>
        </div>
        <div>
          <p>Contato</p>
          <p>contato@fepipy.com</p>
        </div>
      </footer>
    </div>
  );
}
