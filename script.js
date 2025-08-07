import { fileSystem } from './fileSystem.js';
import { applyTextStyle, getFileTextStyle } from './textStyle.js';
import { applyGlitchEffect, removeGlitchEffect, startRandomGlitch, stopRandomGlitch, decodeTextEffect, triggerGlitch, decodeLinesSequentially } from './glitch.js';

const terminalDiv = document.getElementById('terminal');
let glitchInterval = null;

let currentDirectory = fileSystem;
let selectedIndex = 0;
let previousDirectory = null;
let previousIndex = 0;
let openedFile = null;
let expandedDirs = new Set();
let visibleItems = [];

function renderDirectoryTree(node = currentDirectory, depth = 0, parentIsLast = false) {
  if (depth === 0) {
    terminalDiv.innerHTML = '';
    visibleItems = [];
  }

  node.children.forEach((item, index) => {
    const isLast = index === node.children.length - 1;
    let prefix = '';
    if (depth > 0) {
      prefix += ' '.repeat((depth - 1) * 2);
      prefix += parentIsLast ? '  ' : '│ ';
    }
    prefix += isLast ? '└─ ' : '├─ ';

    visibleItems.push({ item, depth, isLast });

    const cursor = visibleItems.length - 1 === selectedIndex ? '> ' : '  ';
    const line = document.createElement('pre');
    line.classList.add('glitch-text');
    line.textContent = `${cursor}${prefix}${item.name}${item.type === 'directory' ? '/' : ''}`;
    line.setAttribute('data-text', line.textContent);

    applyTextStyle(line, visibleItems.length - 1 === selectedIndex);
    applyGlitchEffect(line);

    terminalDiv.appendChild(line);

    // Якщо директорія розгорнута, показуємо її вміст рекурсивно
    if (item.type === 'directory' && expandedDirs.has(item)) {
      renderDirectoryTree(item, depth + 1, isLast);
    }
  });

  terminalDiv.focus();

  // Запускаємо глітч на вибраному елементі
  const selectedLine = terminalDiv.children[selectedIndex];
  if (selectedLine) {
      triggerGlitch(selectedLine);
      // або просто використовуйте decodeTextEffect(selectedLine, selectedLine.dataset.text);
  }
}

function renderFileContent(file) {
  const style = getFileTextStyle();

  const render = (text) => {
    terminalDiv.innerHTML = '';
    const linesText = text.split('\n');
    const lines = [];
    linesText.forEach(lineText => {
        const line = document.createElement('pre');
        line.classList.add('glitch-text');
        line.setAttribute('data-text', lineText);
        line.style.color = style.color;
        line.style.textShadow = style.textShadow;
        terminalDiv.appendChild(line);
        lines.push(line);
    });
    decodeLinesSequentially(lines, linesText, 10); // 10 мс між символами
    terminalDiv.focus();
  };

  if (file.external && file.path) {
    fetch(file.path)
      .then(response => response.text())
      .then(text => render(text))
      .catch(() => render('Не вдалося завантажити файл.'));
  } else {
    render(file.content);
  }
}

function navigateTo(item) {
  if (item.type === 'directory') {
    currentDirectory = item;
    selectedIndex = 0;
    openedFile = null;
    renderDirectoryTree();
  } else {
    previousDirectory = currentDirectory;
    previousIndex = selectedIndex;
    openedFile = item;
    renderFileContent(item);
  }
}

function navigateBack() {
  if (openedFile) {
    currentDirectory = previousDirectory || fileSystem;
    selectedIndex = previousIndex || 0;
    openedFile = null;
    previousDirectory = null;
    previousIndex = 0;
    renderDirectoryTree();
    return;
  }
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
    if (visibleItems.length === 0) return;

    switch (event.code) {
        case 'KeyW':
            selectedIndex = (selectedIndex - 1 + visibleItems.length) % visibleItems.length;
            renderDirectoryTree();
            break;
        case 'KeyS':
            selectedIndex = (selectedIndex + 1) % visibleItems.length;
            renderDirectoryTree();
            break;
        case 'KeyD':
            navigateTo(visibleItems[selectedIndex].item);
            break;
        case 'KeyA':
            navigateBack();
            break;
        case 'KeyE':
            const selectedItem = visibleItems[selectedIndex].item;
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
startRandomGlitch(terminalDiv); // якщо треба, передай terminalDiv
