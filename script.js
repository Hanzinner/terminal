const terminalDiv = document.getElementById('terminal');

const fileSystem = {
  name: '/',
  type: 'directory',
  children: [
    {
      name: 'main',
      type: 'directory',
      children: [
        { name: 'about.txt', type: 'file', content: 'THIS IS DECLASSIFIED STORAGE OF HERODOTUS-XI SYSTEM. ALL RIGHTS RESERVED.' }
      ]
    },
    {
      name: 'logs',
      type: 'directory',
      children: [
        { name: 'LOG-777.txt', type: 'file', external: true, path: 'LOG-777.txt' }
      ]
    },
    { 
      name: 'welcome.txt',
      type: 'file',
      content: 'Welcome to my retro terminal! Use arrow keys to navigate.' 
    },
    { 
      name: 'skull.txt', 
      type: 'file', 
      content: `
           .--.
          / /  ''
         | |
         | |   .--. 
  ,----. | |  /    '
 /  .'''.| | |  .''|
|  /  | || | |  |  |
|  |  | || | |  |  |
|  |  '-'| | |  |  |
|  |     | | |  |  |
'--'     '-' '--'  ~--'
`
    }
  ]
};


let currentDirectory = fileSystem;
let selectedIndex = 0;
let previousDirectory = null;
let previousIndex = 0;
let openedFile = null; // Додаємо змінну
let expandedDirs = new Set();

function renderDirectoryTree(node = currentDirectory, depth = 0, parentIsLast = false) {
  if (depth === 0) terminalDiv.innerHTML = '';

  node.children.forEach((item, index) => {
    const isLast = index === node.children.length - 1;
    let prefix = '';
    if (depth > 0) {
      prefix += ' '.repeat((depth - 1) * 2);
      prefix += parentIsLast ? '  ' : '│ ';
    }
    prefix += isLast ? '└─ ' : '├─ ';

    const line = document.createElement('pre');
    line.textContent = `${depth === 0 && index === selectedIndex ? '> ' : '  '}${prefix}${item.name}${item.type === 'directory' ? '/' : ''}`;
    terminalDiv.appendChild(line);

    // Якщо директорія розгорнута, показуємо її вміст рекурсивно
    if (item.type === 'directory' && expandedDirs.has(item)) {
      renderDirectoryTree(item, depth + 1, isLast);
    }
  });

  terminalDiv.focus();
}

function renderFileContent(file) {
  if (file.external && file.path) {
    fetch(file.path)
      .then(response => response.text())
      .then(text => {
        terminalDiv.innerHTML = `<pre>${text}</pre>`;
        terminalDiv.focus();
      })
      .catch(() => {
        terminalDiv.innerHTML = `<pre>Не вдалося завантажити файл.</pre>`;
        terminalDiv.focus();
      });
  } else {
    terminalDiv.innerHTML = `<pre>${file.content}</pre>`;
    terminalDiv.focus();
  }
}

function navigateTo(item) {
  if (item.type === 'directory') {
    currentDirectory = item;
    selectedIndex = 0;
    openedFile = null; // Скидаємо файл
    renderDirectoryTree();
  } else {
    previousDirectory = currentDirectory;
    previousIndex = selectedIndex;
    openedFile = item; // Запам'ятовуємо відкритий файл
    renderFileContent(item);
  }
}

function navigateBack() {
  if (openedFile) {
    // Якщо відкритий файл, повертаємося до попередньої директорії
    currentDirectory = previousDirectory || fileSystem;
    selectedIndex = previousIndex || 0;
    openedFile = null;
    previousDirectory = null;
    previousIndex = 0;
    renderDirectoryTree();
    return;
  }
  // Якщо ми не у корені, повертаємось до батьківської директорії
  if (currentDirectory !== fileSystem) {
    const parent = findParent(fileSystem, currentDirectory);
    if (parent) {
      const prevIndex = parent.children.findIndex(child => child === currentDirectory);
      currentDirectory = parent;
      selectedIndex = prevIndex >= 0 ? prevIndex : 0;
      renderDirectoryTree();
    }
  }
}

function findParent(node, target) {
  if (!node.children) {
    return null;
  }
  for (const child of node.children) {
    if (child === target) {
      return node;
    }
    const found = findParent(child, target);
    if (found) {
      return found;
    }
  }
  return null;
}


document.addEventListener('keydown', (event) => {
    const items = currentDirectory.children;
    // Перевірка, чи є взагалі що вибирати, щоб уникнути помилок
    if (!items || items.length === 0) {
        // Якщо ми всередині файлу, а не папки, дозволяємо вихід назад
        if (event.code === 'KeyA') {
            navigateBack();
        }
        return;
    }

    switch (event.code) { // event.code працює незалежно від розкладки
        case 'KeyW': // Вгору
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            renderDirectoryTree();
            break;
        case 'KeyS': // Вниз
            selectedIndex = (selectedIndex + 1) % items.length;
            renderDirectoryTree();
            break;
        case 'KeyD': // Вхід / Вибір
            navigateTo(items[selectedIndex]);
            break;
        case 'KeyA': // Назад
            navigateBack();
            break;
        case 'KeyE': // Розгортаємо/згортаємо директорію
            const selectedItem = items[selectedIndex];
            if (selectedItem.type === 'directory') {
                if (expandedDirs.has(selectedItem)) {
                    expandedDirs.delete(selectedItem);
                } else {
                    expandedDirs.add(selectedItem);
                }
                renderDirectoryTree();
            }
            break;
    }
});

// Додаємо фокус при кліку по терміналу
terminalDiv.addEventListener('click', () => {
  terminalDiv.focus();
});

// Додаємо фокус при завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => {
  terminalDiv.focus();
});

renderDirectoryTree();

