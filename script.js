const terminalDiv = document.getElementById('terminal');

const fileSystem = {
  name: '/',
  type: 'directory',
  children: [
    {
      name: 'docs',
      type: 'directory',
      children: [
        { name: 'about.txt', type: 'file', content: 'This is a project by a user learning to code with AI.' }
      ]
    },
    {
      name: 'projects',
      type: 'directory',
      children: [
        { name: 'project1.txt', type: 'file', content: 'This is the first cool project!' }
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
'--'     '-' '--'  '--'
`
    }
  ]
};


let currentDirectory = fileSystem;
let selectedIndex = 0;



function renderDirectory() {
  terminalDiv.innerHTML = '';
  currentDirectory.children.forEach((item, index) => {
    const line = document.createElement('pre');
    line.textContent = `${index === selectedIndex ? '> ' : '  '}${item.name}${item.type === 'directory' ? '/' : ''}`;
    terminalDiv.appendChild(line);
  });
}

function renderFileContent(file) {
  terminalDiv.innerHTML = `<pre>${file.content}</pre>`;
}

function navigateTo(item) {
  if (item.type === 'directory') {
    currentDirectory = item;
    selectedIndex = 0;
    renderDirectory();
  } else {
    renderFileContent(item);
  }
}

function navigateBack() {
  if (currentDirectory !== fileSystem) {
    const parent = findParent(fileSystem, currentDirectory);
    if (parent) {
      currentDirectory = parent;
      selectedIndex = parent.children.indexOf(currentDirectory); // This might not be correct if we want to select the previously selected item
      renderDirectory();
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
        if (event.key.toLowerCase() === 'a') {
            navigateBack();
        }
        return;
    }

    switch (event.key.toLowerCase()) { // toLowerCase() ігнорує Shift
        case 'w': // Вгору
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            renderDirectory();
            break;
        case 's': // Вниз
            selectedIndex = (selectedIndex + 1) % items.length;
            renderDirectory();
            break;
        case 'e': // Вхід / Вибір
            navigateTo(items[selectedIndex]);
            break;
        case 'a': // Назад
            navigateBack();
            break;
    }
});


renderDirectory();



