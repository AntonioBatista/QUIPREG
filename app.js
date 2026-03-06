let allQuestions = [];

async function loadSubject(subject){
  const indexRes = await fetch(`../${subject}/indexquim.json`);
  const index = await indexRes.json();

  const topicSelect = document.getElementById("topic");
  topicSelect.innerHTML = '<option value="all">Todos los temas</option>';

  for(const t of index.topics){
    const opt = document.createElement("option");
    opt.value = t.file;
    opt.textContent = `${t.name} (${t.count})`;
    topicSelect.appendChild(opt);
  }

  allQuestions = [];

  for(const t of index.topics){
    const res = await fetch(`../${subject}/${t.file}`);
    const data = await res.json();
    allQuestions.push(...data);
  }

  renderQuestions();
}

function renderQuestions(){
  const term = document.getElementById("search").value.toLowerCase();
  const topicFile = document.getElementById("topic").value;
  const results = document.getElementById("results");

  const filtered = allQuestions.filter(q=>{
    const matchesSearch = q.text.toLowerCase().includes(term);
    const matchesTopic = topicFile==="all" || q.topic_name.includes(topicFile.replace(".json",""));
    return matchesSearch && matchesTopic;
  });

  results.innerHTML = filtered.map(q=>`
    <div class="question">
      <div class="meta">${q.exam_year} · ${q.exam_model} · ${q.topic_name}</div>
      <div>${q.text}</div>
    </div>
  `).join("");
}

document.getElementById("search").addEventListener("input",renderQuestions);
document.getElementById("topic").addEventListener("change",renderQuestions);
document.getElementById("subject").addEventListener("change",e=>loadSubject(e.target.value));

loadSubject("quimica");
