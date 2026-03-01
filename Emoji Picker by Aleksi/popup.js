const emojis = [
    { char: '😀', tags: ['smile', 'happy'] },
    { char: '😂', tags: ['laugh', 'tears'] },
    { char: '❤️', tags: ['heart', 'love'] },
    { char: '👍', tags: ['thumbs', 'up', 'yes'] },
    { char: '🔥', tags: ['fire', 'hot', 'lit'] },
    { char: '¯\(ツ)/¯', tags: ['shrug', 'kaomoji'] },
    { char: '( ͡° ͜ʖ ͡°)', tags: ['lenny', 'face'] }
];

const grid = document.getElementById('grid');
const search = document.getElementById('search');

function render(filter = '') {
    grid.innerHTML = '';
    const filtered = emojis.filter(e =>
        e.tags.some(tag => tag.includes(filter.toLowerCase())) || filter === ''
    );

    filtered.forEach(e => {
        const div = document.createElement('div');
        div.className = 'emoji';
        div.textContent = e.char;
        div.addEventListener('click', () => {
            navigator.clipboard.writeText(e.char);
            // Visual feedback
            div.style.background = '#4CAF50';
            setTimeout(() => div.style.background = '', 200);
        });
        grid.appendChild(div);
    });
}

search.addEventListener('input', (e) => render(e.target.value));
render();
