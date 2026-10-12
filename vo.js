const scheduleData = [
  {
    title: 'Salangai Pooja',
    subtitle: 'Beginner Foundation',
    category: 'weekday',
    level: 'Beginner',
    time: 'Mon & Wed • 6:00 PM - 7:00 PM',
    fees: '₹2,000 / month',
    description: 'Structured grounding in posture, rhythm, and foundational adavus.'
  },
  {
    title: 'Alarippu & Jathiswaram',
    subtitle: 'Intermediate Technique',
    category: 'weekday',
    level: 'Intermediate',
    time: 'Tue & Thu • 6:30 PM - 8:00 PM',
    fees: '₹2,800 / month',
    description: 'Refinement of adavu precision, tala coordination, and expressive clarity.'
  },
  {
    title: 'Varnam & Arangetram',
    subtitle: 'Senior Repertoire',
    category: 'weekday',
    level: 'Senior',
    time: 'Mon to Fri • 7:30 PM - 9:00 PM',
    fees: '₹3,500 / month',
    description: 'Performance preparation with advanced abhinaya and repertoire mastery.'
  },
  {
    title: 'Weekend Master Class',
    subtitle: 'Saturday Intensive',
    category: 'weekend',
    level: 'All Levels',
    time: 'Sat • 9:00 AM - 11:30 AM',
    fees: '₹2,500 / month',
    description: 'Focused classes for technique refinement and ensemble practice.'
  },
  {
    title: 'Sunday Heritage Lab',
    subtitle: 'Family & Community',
    category: 'weekend',
    level: 'Open',
    time: 'Sun • 8:30 AM - 10:00 AM',
    fees: '₹2,200 / month',
    description: 'Traditional repertoire, devotional recitals, and cultural immersion practice.'
  },
  {
    title: 'Intensive Festival Prep',
    subtitle: 'Performance Bootcamp',
    category: 'intensive',
    level: 'Advanced',
    time: 'Selected Weeks • 4:00 PM - 7:00 PM',
    fees: '₹4,000 / session',
    description: 'High-intensity training before showcase, recital, and festival performances.'
  }
];

const STORAGE_KEY = 'krishnaKalalayamRecords';

function renderScheduleCards(items = scheduleData) {
  const container = document.getElementById('scheduleGridContainer');
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="studio-card p-6 space-y-4 ${item.category}">
      <div class="flex items-center justify-between gap-3">
        <span class="font-mono text-[10px] text-brightGold uppercase tracking-wider">${item.level}</span>
        <span class="font-mono text-[10px] text-saffron uppercase">${item.category}</span>
      </div>
      <div>
        <h4 class="text-xl font-bold text-silkIvory uppercase">${item.title}</h4>
        <p class="text-sm text-brightTurquoise mt-1">${item.subtitle}</p>
      </div>
      <p class="text-[12px] text-mutedIvory leading-relaxed">${item.description}</p>
      <div class="pt-4 border-t border-goldBorder text-[11px] text-mutedIvory space-y-2 font-mono">
        <div class="flex justify-between gap-3"><span>TIME</span><span class="text-brightGold text-right">${item.time}</span></div>
        <div class="flex justify-between gap-3"><span>FEE</span><span class="text-silkIvory text-right">${item.fees}</span></div>
      </div>
    </div>
  `).join('');
}

function filterScheduleCategory(category = 'all') {
  const tabs = ['all', 'weekday', 'weekend', 'intensive'];
  tabs.forEach(tab => {
    const button = document.getElementById(`tab-${tab}`);
    if (!button) return;
    const active = tab === category;
    button.className = active
      ? 'px-4 py-2 bg-saffron text-white font-semibold border border-saffron'
      : 'px-4 py-2 bg-cardMaroon text-mutedIvory hover:text-brightGold border studio-border';
  });

  const filtered = category === 'all'
    ? scheduleData
    : scheduleData.filter(item => item.category === category);

  renderScheduleCards(filtered);
}

function toggleMobileNav() {
  const drawer = document.getElementById('mobileDrawer');
  if (!drawer) return;
  drawer.classList.toggle('hidden');
}

function updateClock() {
  const liveClock = document.getElementById('liveClock');
  const mobileClock = document.getElementById('mobileClock');
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  });
  const time = formatter.format(now);

  if (liveClock) liveClock.textContent = time;
  if (mobileClock) mobileClock.textContent = time;
}

function getStoredRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function saveStoredRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function renderDashboard() {
  const records = getStoredRecords();
  const totalEl = document.getElementById('dashTotal');
  const paidEl = document.getElementById('dashPaid');
  const pendingEl = document.getElementById('dashPending');

  if (!totalEl || !paidEl || !pendingEl) return;

  const total = records.length;
  const paid = records.filter(record => record.feeStatus === 'Paid').length || total;
  const pending = Math.max(0, total - paid);

  totalEl.textContent = total;
  paidEl.textContent = paid;
  pendingEl.textContent = pending;
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const record = {
    name: document.getElementById('formName').value.trim(),
    age: document.getElementById('formAge').value,
    batch: document.getElementById('formBatch').value,
    phone: document.getElementById('formPhone').value.trim(),
    email: document.getElementById('formEmail').value.trim(),
    guardian: document.getElementById('formGuardian').value.trim(),
    joiningDate: document.getElementById('formDate').value,
    feeStatus: 'Paid',
    submittedAt: new Date().toISOString()
  };

  const records = getStoredRecords();
  records.push(record);
  saveStoredRecords(records);
  renderDashboard();

  const existingStatus = document.getElementById('formStatus');
  const status = existingStatus || document.createElement('div');

  status.id = 'formStatus';
  status.className = 'mt-4 border border-emerald-500 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-mono';
  status.textContent = `Registration saved for ${record.name}. Student record added successfully.`;

  if (!existingStatus) {
    form.parentNode.appendChild(status);
  }

  form.reset();
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function exportDataCSV() {
  const records = getStoredRecords();
  if (!records.length) {
    const row = ['name', 'age', 'batch', 'phone', 'email', 'guardian', 'joiningDate', 'feeStatus', 'submittedAt'];
    downloadFile('krishna-kalalayam-students.csv', row.join(',') + '\n', 'text/csv;charset=utf-8;');
    return;
  }

  const headers = ['name', 'age', 'batch', 'phone', 'email', 'guardian', 'joiningDate', 'feeStatus', 'submittedAt'];
  const rows = records.map(record => headers.map(header => `"${String(record[header] || '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  downloadFile('krishna-kalalayam-students.csv', csv, 'text/csv;charset=utf-8;');
}

function exportDataJSON() {
  const records = getStoredRecords();
  downloadFile('krishna-kalalayam-students.json', JSON.stringify(records, null, 2), 'application/json;charset=utf-8;');
}

function createModal() {
  let modal = document.getElementById('addRecordModal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'addRecordModal';
  modal.className = 'fixed inset-0 hidden items-center justify-center bg-black/70 z-50';
  modal.innerHTML = `
    <div class="w-full max-w-xl bg-templeMaroon border border-goldBorder p-6 shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="font-mono text-xs text-brightGold uppercase">ADD STUDENT RECORD</div>
          <h3 class="text-xl font-bold text-silkIvory uppercase mt-1">New Enrollment</h3>
        </div>
        <button type="button" id="closeModalBtn" class="text-silkIvory hover:text-brightGold text-xl">×</button>
      </div>
      <form id="addRecordForm" class="space-y-4 font-mono text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-mutedIvory mb-2 uppercase">Student Name</label>
            <input id="modalName" type="text" required class="w-full bg-deepMaroon border studio-border px-3 py-2 text-silkIvory focus:outline-none focus:border-brightGold">
          </div>
          <div>
            <label class="block text-mutedIvory mb-2 uppercase">Age</label>
            <input id="modalAge" type="number" min="5" max="85" required class="w-full bg-deepMaroon border studio-border px-3 py-2 text-silkIvory focus:outline-none focus:border-brightGold">
          </div>
          <div>
            <label class="block text-mutedIvory mb-2 uppercase">Batch</label>
            <select id="modalBatch" required class="w-full bg-deepMaroon border studio-border px-3 py-2 text-silkIvory focus:outline-none focus:border-brightGold">
              <option value="">SELECT BATCH</option>
              <option value="Salangai Pooja (Beginner)">Salangai Pooja (Beginner)</option>
              <option value="Alarippu & Jathiswaram (Intermediate)">Alarippu & Jathiswaram (Intermediate)</option>
              <option value="Varnam & Arangetram (Senior)">Varnam & Arangetram (Senior)</option>
              <option value="Adult & Weekend Special">Adult & Weekend Special</option>
            </select>
          </div>
          <div>
            <label class="block text-mutedIvory mb-2 uppercase">Phone</label>
            <input id="modalPhone" type="tel" required class="w-full bg-deepMaroon border studio-border px-3 py-2 text-silkIvory focus:outline-none focus:border-brightGold">
          </div>
          <div class="sm:col-span-2">
            <label class="block text-mutedIvory mb-2 uppercase">Email</label>
            <input id="modalEmail" type="email" required class="w-full bg-deepMaroon border studio-border px-3 py-2 text-silkIvory focus:outline-none focus:border-brightGold">
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" id="cancelModalBtn" class="px-4 py-2 bg-cardMaroon border studio-border text-silkIvory hover:text-brightGold">CANCEL</button>
          <button type="submit" class="px-4 py-2 dance-btn font-bold">SAVE RECORD</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

  document.getElementById('addRecordForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = {
      name: document.getElementById('modalName').value.trim(),
      age: document.getElementById('modalAge').value,
      batch: document.getElementById('modalBatch').value,
      phone: document.getElementById('modalPhone').value.trim(),
      email: document.getElementById('modalEmail').value.trim(),
      guardian: '',
      joiningDate: new Date().toISOString().split('T')[0],
      feeStatus: 'Paid',
      submittedAt: new Date().toISOString()
    };

    const existing = getStoredRecords();
    existing.push(payload);
    saveStoredRecords(existing);
    renderDashboard();
    closeModal();
    event.target.reset();
  });

  return modal;
}

function openAddModal() {
  const modal = createModal();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function togglePortalView() {
  const statusEl = document.getElementById('portalLockStatus');
  if (!statusEl) return;

  const unlocked = document.body.dataset.portalUnlocked === 'true';

  if (unlocked) {
    document.body.dataset.portalUnlocked = 'false';
    statusEl.textContent = '[ LOCKED / AUTH REQUIRED ]';
    statusEl.className = 'text-saffron font-mono';
    alert('Portal locked. Please re-authenticate to view admin data.');
    return;
  }

  const password = prompt('Enter admin password to unlock the portal:', '');
  if (password === 'admin' || password === '1234') {
    document.body.dataset.portalUnlocked = 'true';
    statusEl.textContent = '[ UNLOCKED / AUTH VERIFIED ]';
    statusEl.className = 'text-emerald-400 font-mono';
    renderDashboard();
    openAddModal();
  } else {
    alert('Incorrect password. Please try again.');
  }
}

function initializeWebsite() {
  renderScheduleCards();
  filterScheduleCategory('all');
  updateClock();
  renderDashboard();
  setInterval(updateClock, 1000);

  const portalState = document.getElementById('portalLockStatus');
  if (portalState) {
    portalState.textContent = '[ LOCKED / AUTH REQUIRED ]';
  }
}

document.addEventListener('DOMContentLoaded', initializeWebsite);

window.toggleMobileNav = toggleMobileNav;
window.filterScheduleCategory = filterScheduleCategory;
window.handleFormSubmit = handleFormSubmit;
window.togglePortalView = togglePortalView;
window.exportDataCSV = exportDataCSV;
window.exportDataJSON = exportDataJSON;
window.openAddModal = openAddModal;
window.updateClock = updateClock;
window.renderDashboard = renderDashboard;
