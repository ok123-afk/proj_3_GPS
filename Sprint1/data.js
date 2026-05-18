// ===== EventFlow — Shared Data Layer (localStorage) =====

const DB = {
  get(key) { try { return JSON.parse(localStorage.getItem('ef_'+key)) || null; } catch { return null; } },
  set(key, val) { localStorage.setItem('ef_'+key, JSON.stringify(val)); },
  remove(key) { localStorage.removeItem('ef_'+key); }
};

// ---- SEED DEFAULT DATA ----
function seedIfEmpty() {
  if (!DB.get('seeded')) {
    DB.set('users', [
      { id:1, name:'Ana Costa', email:'ana.costa@email.com', role:'Admin', status:'Ativo', since:'Jan 2025', prefs:'Email', hist:[1,2,3] },
      { id:2, name:'Pedro Matos', email:'pedro.matos@email.com', role:'Organizador', status:'Ativo', since:'Mar 2025', prefs:'Ambos', hist:[1,4] },
      { id:3, name:'Rita Santos', email:'rita.santos@email.com', role:'Orador', status:'Ativo', since:'Fev 2025', prefs:'Notificação', hist:[2,5] },
      { id:4, name:'João Ferreira', email:'joao.f@email.com', role:'Participante', status:'Ativo', since:'Abr 2025', prefs:'Email', hist:[1] },
      { id:5, name:'Margarida Lima', email:'m.lima@email.com', role:'Participante', status:'Inativo', since:'Jun 2025', prefs:'Email', hist:[3] },
      { id:6, name:'Carlos Mendes', email:'c.mendes@email.com', role:'Participante', status:'Ativo', since:'Nov 2024', prefs:'Ambos', hist:[1,4,3] },
      { id:7, name:'Sofia Alves', email:'sofia.a@email.com', role:'Organizador', status:'Ativo', since:'Dez 2024', prefs:'Email', hist:[2] },
    ]);

    DB.set('events', [
      { id:1, name:'Tech Summit 2026', date:'2026-05-15', local:'Online', format:'online', status:'ativo', capacity:500, desc:'Conferência de tecnologia e inovação.' },
      { id:2, name:'UX Design Workshop', date:'2026-05-22', local:'Lisboa', format:'presencial', status:'planeado', capacity:80, desc:'Workshop intensivo de design centrado no utilizador.' },
      { id:3, name:'DevOps Conference', date:'2026-06-03', local:'Porto / Online', format:'hibrido', status:'planeado', capacity:300, desc:'Conferência sobre práticas DevOps e automação.' },
      { id:4, name:'AI & Data Science Forum', date:'2026-06-20', local:'Online', format:'online', status:'planeado', capacity:1000, desc:'Fórum sobre IA aplicada e análise de dados.' },
      { id:5, name:'Startup Pitch Day', date:'2026-04-10', local:'Braga', format:'presencial', status:'concluido', capacity:150, desc:'Pitches de startups para investidores.' },
    ]);

    DB.set('speakers', [
      { id:1, name:'Ana Costa', org:'Google Portugal', area:'IA & Machine Learning', sessions:[1,4], bio:'Engenheira de IA com 10 anos de experiência.' },
      { id:2, name:'Pedro Matos', org:'Microsoft', area:'Cloud & DevOps', sessions:[3], bio:'Arquiteto cloud certificado Azure.' },
      { id:3, name:'Rita Santos', org:'Farfetch', area:'UX Design', sessions:[2], bio:'Designer de produto com foco em acessibilidade.' },
      { id:4, name:'Carlos Lima', org:'Outsystems', area:'Low-Code Development', sessions:[1], bio:'Developer advocate na Outsystems.' },
      { id:5, name:'Sofia Alves', org:'Feedzai', area:'Fraud Detection & AI', sessions:[4], bio:'Investigadora em deteção de fraude com IA.' },
    ]);

    DB.set('sessions', [
      { id:1, eventId:1, title:'IA e o Futuro do Trabalho', speakerId:1, start:'10:00', end:'11:00', room:'Sala A', favorites:0 },
      { id:2, eventId:1, title:'Cloud Native Apps com Azure', speakerId:2, start:'11:15', end:'12:15', room:'Sala B', favorites:0 },
      { id:3, eventId:2, title:'Design Thinking Avançado', speakerId:3, start:'09:00', end:'12:00', room:'Sala Principal', favorites:0 },
      { id:4, eventId:3, title:'CI/CD na Prática', speakerId:2, start:'14:00', end:'15:00', room:'Online', favorites:0 },
      { id:5, eventId:4, title:'LLMs e Aplicações Empresariais', speakerId:1, start:'10:30', end:'11:30', room:'Online', favorites:0 },
      { id:6, eventId:4, title:'Deteção de Anomalias com IA', speakerId:5, start:'14:00', end:'15:00', room:'Online', favorites:0 },
    ]);

    DB.set('registrations', [
      { id:1, userId:4, eventId:1, status:'confirmado', checkin:true, date:'2026-05-01' },
      { id:2, userId:6, eventId:1, status:'confirmado', checkin:false, date:'2026-05-02' },
      { id:3, userId:5, eventId:3, status:'pendente', checkin:false, date:'2026-05-03' },
      { id:4, userId:2, eventId:2, status:'confirmado', checkin:false, date:'2026-04-28' },
    ]);

    DB.set('feedbacks', [
      { id:1, userId:4, sessionId:1, rating:5, comment:'Excelente apresentação!', date:'2026-05-15' },
      { id:2, userId:6, sessionId:2, rating:4, comment:'Muito informativo.', date:'2026-05-15' },
      { id:3, userId:2, sessionId:3, rating:5, comment:'Workshop prático e bem estruturado.', date:'2026-05-22' },
    ]);

    DB.set('questions', [
      { id:1, sessionId:1, userId:4, text:'Como a IA vai afetar empregos?', votes:12, answered:false, date:'2026-05-15' },
      { id:2, sessionId:1, userId:6, text:'Quais ferramentas recomendam para MLOps?', votes:8, answered:true, date:'2026-05-15' },
      { id:3, sessionId:3, userId:2, text:'Existe template para Design Sprint?', votes:5, answered:false, date:'2026-05-22' },
    ]);

    DB.set('polls', [
      { id:1, sessionId:1, question:'Qual área de IA mais te interessa?', options:[{label:'LLMs',votes:45},{label:'Computer Vision',votes:28},{label:'MLOps',votes:18},{label:'RL',votes:9}], active:true },
    ]);

    DB.set('notifications', [
      { id:1, type:'email', title:'Confirmação de Inscrição', msg:'A sua inscrição no Tech Summit 2026 foi confirmada.', date:'2026-05-01', sent:true },
      { id:2, type:'push', title:'Lembrete de Evento', msg:'O Tech Summit 2026 começa em 3 dias!', date:'2026-05-12', sent:true },
      { id:3, type:'email', title:'Alteração de Horário', msg:'A sessão "IA e o Futuro" foi movida para as 10h00.', date:'2026-05-10', sent:false },
    ]);

    DB.set('favorites', []);
    DB.set('nextId', { users:8, events:6, speakers:6, sessions:7, regs:5, feedbacks:4, questions:4, polls:2, notifs:4 });
    DB.set('seeded', true);
  }
}

function nextId(key) {
  const ids = DB.get('nextId') || {};
  ids[key] = (ids[key] || 1) + 1;
  DB.set('nextId', ids);
  return ids[key];
}

seedIfEmpty();
