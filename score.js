// 假设分组数据从本地存储或index页面传递，这里用示例数据
const GROUPS_KEY = 'guandan_groups';
const SCORES_KEY = 'guandan_scores';

// 示例分组数据（实际可从index页面存储到localStorage）
let groups = JSON.parse(localStorage.getItem(GROUPS_KEY)) || [
    ['李嘉诚','王思源','张宇航','刘志强'],
    ['陈俊杰','赵子涵','孙浩然','周梓萱'],
    ['吴雨辰','郑嘉豪','冯思远','朱明轩'],
    ['林子墨','何俊宇','高梓涵','郭思琪'],
    ['马俊熙','罗子豪','梁思成','许梓萱'],
    ['邓宇轩','曹梓睿','彭思源','谢俊豪']
];

let scores = JSON.parse(localStorage.getItem(SCORES_KEY)) || {};

const groupSelect = document.getElementById('groupSelect');
const playersArea = document.getElementById('playersArea');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const scoreRankBody = document.getElementById('scoreRankBody');
const clearScoreBtn = document.getElementById('clearScoreBtn');

let clearConfirmStep = 0;

function renderGroupOptions() {
    groupSelect.innerHTML = '';
    groups.forEach((g, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `第${i+1}桌`;
        groupSelect.appendChild(opt);
    });
}

function renderPlayersInputs(idx) {
    playersArea.innerHTML = '';
    const group = groups[idx];
    group.forEach(name => {
        const div = document.createElement('div');
        div.style.marginBottom = '8px';
        div.innerHTML = `<label>${name}：</label><input type='number' min='0' value='0' data-name='${name}' />`;
        playersArea.appendChild(div);
    });
}

function saveScores() {
    const idx = groupSelect.value;
    const group = groups[idx];
    const inputs = playersArea.querySelectorAll('input');
    inputs.forEach(input => {
        const name = input.getAttribute('data-name');
        const val = parseInt(input.value, 10) || 0;
        if (!scores[name]) scores[name] = 0;
        scores[name] += val;
    });
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    renderRank();
    alert('积分已保存！');
}

function renderRank() {
    // 生成排行榜
    const arr = Object.entries(scores).map(([name, score]) => ({name, score}));
    arr.sort((a, b) => b.score - a.score);
    scoreRankBody.innerHTML = arr.map((item, i) =>
        `<tr><td>${i+1}</td><td>${item.name}</td><td>${item.score}</td></tr>`
    ).join('');
}

function clearScores() {
    if (clearConfirmStep === 0) {
        clearScoreBtn.textContent = '再次点击确认清空';
        clearScoreBtn.style.background = '#d7263d';
        clearConfirmStep = 1;
        setTimeout(() => {
            clearScoreBtn.textContent = '清空积分';
            clearScoreBtn.style.background = '#ff5e62';
            clearConfirmStep = 0;
        }, 2000);
    } else {
        scores = {};
        localStorage.removeItem(SCORES_KEY);
        renderRank();
        clearScoreBtn.textContent = '清空积分';
        clearScoreBtn.style.background = '#ff5e62';
        clearConfirmStep = 0;
    }
}

// 初始化
renderGroupOptions();
renderPlayersInputs(0);
renderRank();

groupSelect.onchange = e => {
    renderPlayersInputs(e.target.value);
};
saveScoreBtn.onclick = saveScores;
clearScoreBtn.onclick = clearScores; 