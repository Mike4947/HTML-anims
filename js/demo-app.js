/**
 * Flowboard App — interactive mock driven by animated cursor demo.
 */
(function () {
  'use strict';

  const panels = {
    dashboard: document.getElementById('panel-dashboard'),
    tasks: document.getElementById('panel-tasks'),
    team: document.getElementById('panel-team'),
    settings: document.getElementById('panel-settings'),
  };

  const navItems = [...document.querySelectorAll('.nav-item')];
  const topbarTitle = document.getElementById('topbar-title');
  const taskList = document.getElementById('task-list');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById('task-modal');
  const taskInput = document.getElementById('task-input');
  const statTasks = document.getElementById('stat-tasks');
  const toggleNotif = document.getElementById('toggle-notifications');
  const toggleDark = document.getElementById('toggle-darkmode');

  const titles = {
    dashboard: 'Dashboard',
    tasks: 'My Tasks',
    team: 'Team',
    settings: 'Settings',
  };

  let currentPanel = 'dashboard';
  const INITIAL_TASK_COUNT = 3;
  let taskCount = INITIAL_TASK_COUNT;

  const INITIAL_TASKS_HTML = taskList.innerHTML;

  // ── App actions (same handlers a real user would trigger) ──────────

  function flashClick(el) {
    el.classList.add('clicked');
    setTimeout(() => el.classList.remove('clicked'), 150);
  }

  function navigate(panelId) {
    if (panelId === currentPanel) return;

    const prev = panels[currentPanel];
    const next = panels[panelId];

    prev.classList.remove('active');
    prev.classList.add('panel-leaving');
    setTimeout(() => prev.classList.remove('panel-leaving'), 350);

    next.classList.add('active');
    topbarTitle.style.opacity = '0';
    setTimeout(() => {
      topbarTitle.textContent = titles[panelId];
      topbarTitle.style.opacity = '1';
    }, 150);

    navItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.panel === panelId);
    });

    currentPanel = panelId;

    if (panelId === 'dashboard') animateDashboard();
    if (panelId === 'tasks') showExistingTasks();
  }

  function showExistingTasks() {
    [...taskList.querySelectorAll('.task-item')].forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  }

  function animateDashboard() {
    document.querySelectorAll('.activity-item').forEach((el, i) => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 200 + i * 120);
    });
  }

  function openTaskModal() {
    modalBackdrop.classList.add('open');
    modal.classList.add('open');
    taskInput.value = '';
  }

  function closeTaskModal() {
    modalBackdrop.classList.remove('open');
    modal.classList.remove('open');
  }

  function typeText(text, speed = 70) {
    return new Promise((resolve) => {
      taskInput.value = '';
      let i = 0;
      const tick = () => {
        if (i < text.length) {
          taskInput.value += text[i++];
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      };
      tick();
    });
  }

  function addTask(label) {
    closeTaskModal();
    taskCount++;

    const item = document.createElement('div');
    item.className = 'task-item new-task';
    item.innerHTML = `
      <div class="task-check"></div>
      <span class="task-label">${label}</span>
      <span class="task-priority">High</span>
    `;
    taskList.prepend(item);

    requestAnimationFrame(() => {
      item.classList.add('visible');
      setTimeout(() => item.classList.remove('new-task'), 1200);
    });

    statTasks.textContent = taskCount;
    statTasks.classList.add('highlight');
    setTimeout(() => statTasks.classList.remove('highlight'), 800);

    document.getElementById('nav-badge-tasks').textContent = taskCount;

    const activity = document.getElementById('activity-new');
    activity.querySelector('span').textContent = `Task "${label}" created`;
    activity.classList.remove('visible');
    setTimeout(() => activity.classList.add('visible'), 300);
  }

  function toggleTask(index) {
    const items = [...taskList.querySelectorAll('.task-item')];
    const item = items[index];
    if (!item) return;
    const check = item.querySelector('.task-check');
    check.classList.toggle('checked');
    item.classList.toggle('done');
  }

  function selectMember(index) {
    document.querySelectorAll('.member-card').forEach((card, i) => {
      card.classList.toggle('selected', i === index);
    });
  }

  function toggleSetting(btn) {
    btn.classList.toggle('on');
  }

  // Wire manual clicks (user can also interact)
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      flashClick(item);
      navigate(item.dataset.panel);
    });
  });

  document.getElementById('btn-new-task').addEventListener('click', function () {
    flashClick(this);
    openTaskModal();
  });

  document.getElementById('btn-cancel').addEventListener('click', function () {
    flashClick(this);
    closeTaskModal();
  });

  document.getElementById('btn-save').addEventListener('click', function () {
    flashClick(this);
    const label = taskInput.value.trim() || 'Untitled task';
    addTask(label);
  });

  toggleNotif.addEventListener('click', () => toggleSetting(toggleNotif));
  toggleDark.addEventListener('click', () => toggleSetting(toggleDark));

  function resetDemoState() {
    taskList.innerHTML = INITIAL_TASKS_HTML;
    taskCount = INITIAL_TASK_COUNT;
    statTasks.textContent = taskCount;
    document.getElementById('nav-badge-tasks').textContent = taskCount;
    taskInput.value = '';
    closeTaskModal();
    toggleNotif.classList.remove('on');
    document.querySelectorAll('.member-card').forEach((c) => c.classList.remove('selected'));
    document.getElementById('activity-new').querySelector('span').textContent = 'New task added to backlog';
    navigate('dashboard');
    animateDashboard();
  }

  // ── Demo choreography ──────────────────────────────────────────────

  async function runDemo(cursor) {
    const $ = (sel) => document.querySelector(sel);

    cursor.show();
    cursor.setPosition(460, 290);

    while (!cursor.aborted) {
      resetDemoState();
      await cursor.wait(1200);

      // 1 — Navigate to Tasks
      const navTasks = $('[data-panel="tasks"]');
      await cursor.clickEl(navTasks, 600);
      flashClick(navTasks);
      navigate('tasks');
      await cursor.wait(900);

      // 2 — Click "New Task"
      const btnNew = $('#btn-new-task');
      await cursor.clickEl(btnNew, 500);
      flashClick(btnNew);
      openTaskModal();
      await cursor.wait(400);

      // 3 — Click input & type
      await cursor.clickEl(taskInput, 400);
      await typeText('Ship landing page', 65);
      await cursor.wait(350);

      // 4 — Save task
      const btnSave = $('#btn-save');
      await cursor.clickEl(btnSave, 450);
      flashClick(btnSave);
      addTask('Ship landing page');
      await cursor.wait(1000);

      // 5 — Complete first task
      const firstTask = taskList.querySelector('.task-item .task-check');
      if (firstTask) {
        await cursor.clickEl(firstTask, 500);
        flashClick(firstTask.parentElement);
        toggleTask(0);
        await cursor.wait(800);
      }

      // 6 — Navigate to Team
      const navTeam = $('[data-panel="team"]');
      await cursor.clickEl(navTeam, 550);
      flashClick(navTeam);
      navigate('team');
      await cursor.wait(700);

      // 7 — Select a team member
      const member = document.querySelectorAll('.member-card')[1];
      await cursor.clickEl(member, 450);
      selectMember(1);
      await cursor.wait(900);

      // 8 — Navigate to Settings
      const navSettings = $('[data-panel="settings"]');
      await cursor.clickEl(navSettings, 550);
      flashClick(navSettings);
      navigate('settings');
      await cursor.wait(600);

      // 9 — Toggle notifications
      await cursor.clickEl(toggleNotif, 400);
      toggleSetting(toggleNotif);
      await cursor.wait(700);

      // 10 — Back to Dashboard
      const navDash = $('[data-panel="dashboard"]');
      await cursor.clickEl(navDash, 550);
      flashClick(navDash);
      navigate('dashboard');
      await cursor.wait(1500);
    }
  }

  // ── Boot ───────────────────────────────────────────────────────────

  const appWindow = document.getElementById('app-window');
  const cursor = new DemoCursor(appWindow);

  animateDashboard();
  showExistingTasks();

  setTimeout(() => runDemo(cursor), 800);

  global.DemoApp = { navigate, openTaskModal, addTask, cursor };
})();
