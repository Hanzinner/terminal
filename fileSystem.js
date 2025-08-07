export const fileSystem = {
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