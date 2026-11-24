let milestones = JSON.parse(localStorage.getItem("ops_milestones") || "null") || [
  { id: 1, title: "Vendor SLA Sign-off", owner: "Ops Lead", due: "2026-12-05", status: "OnTrack" },
  { id: 2, title: "Q1 Budget Alignment", owner: "Finance", due: "2026-12-18", status: "Done" },
];
let raids = JSON.parse(localStorage.getItem("ops_raids") || "null") || [
  { id: 1, type: "Risk", desc: "Shipping lead-time variance during peak season", severity: "High" },
  { id: 2, type: "Dependency", desc: "Final approval from regional logistics partner", severity: "Medium" },
];

function save() {
  localStorage.setItem("ops_milestones", JSON.stringify(milestones));
  localStorage.setItem("ops_raids", JSON.stringify(raids));
}

function render() {
  const msList = document.getElementById("msList");
  msList.innerHTML = "";
  milestones.forEach((m) => {
    const div = document.createElement("div");
    div.className = "row-item";
    div.innerHTML = `
      <div>
        <strong></strong>
        <div style="font-size:12px;color:#94a3b8;margin-top:3px;">Owner: ${m.owner} &bull; Due: ${m.due}</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <span class="badge ${m.status}">${m.status}</span>
        <button class="small-btn">Toggle</button>
      </div>
    `;
    div.querySelector("strong").textContent = m.title;
    div.querySelector("button").onclick = () => {
      m.status = m.status === "Done" ? "OnTrack" : "Done";
      save(); render();
    };
    msList.appendChild(div);
  });

  const raidList = document.getElementById("raidList");
  raidList.innerHTML = "";
  raids.forEach((r) => {
    const div = document.createElement("div");
    div.className = "row-item";
    div.innerHTML = `
      <div>
        <strong style="font-size:13px;">[${r.type}]</strong> <span class="desc"></span>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <span class="badge ${r.severity}">${r.severity}</span>
        <button class="small-btn">Resolve</button>
      </div>
    `;
    div.querySelector(".desc").textContent = r.desc;
    div.querySelector("button").onclick = () => {
      raids = raids.filter((x) => x.id !== r.id);
      save(); render();
    };
    raidList.appendChild(div);
  });
}

document.getElementById("msForm").addEventListener("submit", (e) => {
  e.preventDefault();
  milestones.push({
    id: Date.now(),
    title: document.getElementById("msTitle").value.trim(),
    owner: document.getElementById("msOwner").value.trim(),
    due: document.getElementById("msDue").value,
    status: "OnTrack",
  });
  save(); e.target.reset(); render();
});

document.getElementById("raidForm").addEventListener("submit", (e) => {
  e.preventDefault();
  raids.push({
    id: Date.now(),
    type: document.getElementById("raidType").value,
    desc: document.getElementById("raidDesc").value.trim(),
    severity: document.getElementById("raidSeverity").value,
  });
  save(); e.target.reset(); render();
});

document.getElementById("exportMdBtn").addEventListener("click", async () => {
  const md = [
    "# Weekly Project Status Report",
    "",
    "## Milestones",
    ...milestones.map((m) => `- [${m.status === "Done" ? "x" : " "}] **${m.title}** (Owner: ${m.owner}, Due: ${m.due})`),
    "",
    "## Active RAID Log",
    ...raids.map((r) => `- **[${r.type} | ${r.severity}]** ${r.desc}`),
  ].join("\n");
  await navigator.clipboard.writeText(md);
  alert("Markdown status report copied to clipboard!");
});

render();
