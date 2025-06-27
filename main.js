// 掼蛋分组酷炫动画主JS

const groupBtn = document.getElementById('groupBtn');
const namesInput = document.getElementById('namesInput');
const groupsContainer = document.getElementById('groupsContainer');
const rankBtn = document.getElementById('rankBtn');

const SEATS = ['东', '南', '西', '北'];

function shuffle(array) {
    // 洗牌算法
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createFirework(x, y, color) {
    // 创建烟花动画
    const firework = document.createElement('canvas');
    firework.className = 'firework';
    firework.width = 200;
    firework.height = 200;
    firework.style.left = `${x - 100}px`;
    firework.style.top = `${y - 100}px`;
    document.body.appendChild(firework);
    const ctx = firework.getContext('2d');
    const particles = [];
    const count = 24 + Math.floor(Math.random() * 12);
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 2;
        particles.push({
            x: 100,
            y: 100,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: color || `hsl(${Math.random()*360},100%,60%)`
        });
    }
    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, 200, 200);
        for (const p of particles) {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.alpha *= 0.96;
        }
        frame++;
        if (frame < 40) {
            requestAnimationFrame(animate);
        } else {
            firework.remove();
        }
    }
    animate();
}

function showGroups(groups) {
    groupsContainer.innerHTML = '';
    groups.forEach((group, idx) => {
        setTimeout(() => {
            const card = document.createElement('div');
            card.className = 'group-card';
            card.style.animationDelay = `${idx * 0.15}s`;
            const title = document.createElement('div');
            title.className = 'group-title';
            title.textContent = `第${idx + 1}组`;
            card.appendChild(title);

            // 牌桌布局
            const table = document.createElement('div');
            table.className = 'table-layout';
            // 东
            const east = document.createElement('div');
            east.className = 'seat-pos seat-east';
            east.innerHTML = `<span class='seat-label'>东</span><br>${group[0]}`;
            table.appendChild(east);
            // 南
            const south = document.createElement('div');
            south.className = 'seat-pos seat-south';
            south.innerHTML = `<span class='seat-label'>南</span><br>${group[1]}`;
            table.appendChild(south);
            // 西
            const west = document.createElement('div');
            west.className = 'seat-pos seat-west';
            west.innerHTML = `<span class='seat-label'>西</span><br>${group[2]}`;
            table.appendChild(west);
            // 北
            const north = document.createElement('div');
            north.className = 'seat-pos seat-north';
            north.innerHTML = `<span class='seat-label'>北</span><br>${group[3]}`;
            table.appendChild(north);
            // 桌子中心
            const center = document.createElement('div');
            center.className = 'table-center';
            center.textContent = '牌桌';
            table.appendChild(center);

            card.appendChild(table);
            groupsContainer.appendChild(card);
            // 烟花动画
            const rect = card.getBoundingClientRect();
            createFirework(rect.left + rect.width/2, rect.top + 40 + window.scrollY);
        }, idx * 350);
    });
}

function showShuffle(names, callback) {
    // 创建洗牌动画遮罩
    const overlay = document.createElement('div');
    overlay.className = 'shuffle-overlay';
    overlay.innerHTML = `<div class='shuffle-text'>正在洗牌...</div>`;
    const cardsBox = document.createElement('div');
    cardsBox.className = 'shuffle-cards';
    // 生成扑克牌
    names.forEach((name, i) => {
        const card = document.createElement('div');
        card.className = 'poker-card shuffle';
        card.textContent = name.length > 4 ? name.slice(0,4)+'…' : name;
        cardsBox.appendChild(card);
    });
    overlay.appendChild(cardsBox);
    document.body.appendChild(overlay);
    // 洗牌动画
    let shuffleTimes = 8 + Math.floor(Math.random()*4);
    let arr = names.slice();
    function doShuffle(times) {
        if (times === 0) {
            // 动画结束
            setTimeout(() => {
                overlay.style.opacity = 0;
                setTimeout(() => {
                    overlay.remove();
                    callback(arr);
                }, 400);
            }, 600);
            return;
        }
        // 视觉洗牌
        arr = shuffle(arr);
        Array.from(cardsBox.children).forEach((card, i) => {
            card.textContent = arr[i].length > 4 ? arr[i].slice(0,4)+'…' : arr[i];
            card.style.transform = `translateY(${Math.random()*30-15}px) rotate(${Math.random()*10-5}deg)`;
        });
        setTimeout(() => doShuffle(times-1), 180);
    }
    doShuffle(shuffleTimes);
}

groupBtn.onclick = function () {
    let names = namesInput.value.split(/\n|,|，/).map(s => s.trim()).filter(Boolean);
    if (names.length % 4 !== 0 || names.length === 0) {
        alert('请输入4的倍数个名字，每行一个');
        return;
    }
    // 新分组规则：前8名分到前两组
    let scores = JSON.parse(localStorage.getItem('guandan_scores') || '{}');
    let rankArr = Object.entries(scores).map(([name, score]) => ({name, score: Number(score)}));
    rankArr.sort((a, b) => b.score - a.score);
    let top8 = rankArr.slice(0, 8).map(r => r.name);
    let rest = names.filter(n => !top8.includes(n));
    if (rankArr.length > 8) {
        // 洗牌动画，洗所有人
        showShuffle(names, function() {
            let groups = [];
            let shuffledTop8 = shuffle(top8.slice());
            groups.push(shuffledTop8.slice(0, 4));
            groups.push(shuffledTop8.slice(4, 8));
            let shuffledRest = shuffle(rest);
            for (let i = 0; i < shuffledRest.length; i += 4) {
                groups.push(shuffledRest.slice(i, i + 4));
            }
            showGroups(groups);
            localStorage.setItem('guandan_groups', JSON.stringify(groups));
        });
    } else {
        showShuffle(names, function(shuffledNames) {
            const groups = [];
            for (let i = 0; i < shuffledNames.length; i += 4) {
                groups.push(shuffledNames.slice(i, i + 4));
            }
            showGroups(groups);
            localStorage.setItem('guandan_groups', JSON.stringify(groups));
        });
    }
};

rankBtn.onclick = function() {
    window.location.href = 'score.html';
};

// 示例数据（可选，便于体验）
// namesInput.value = Array.from({length:24}, (_,i)=>`玩家${i+1}`).join('\n'); 