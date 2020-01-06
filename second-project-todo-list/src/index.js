const electron = require('electron');

const { app, BrowserWindow, ipcMain, Menu } = electron;

let mainWindow;
let addWindow;

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        webPreferences: {
            nodeIntegration: true
        },
        title: "Add New Todo"
    });
    addWindow.loadURL(`file://${__dirname}/add.html`)
    addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event,todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
})

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                accelerator: (() => {
                    if( process.platform === 'darwin') {
                        return 'Command+N';
                    }else {
                        return 'Ctrl+N';
                    }
                })(),
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Todo',
                click(){
                    mainWindow.webContents.send('todo:clear')
                }
            },
            {
                label: 'Quit',
                accelerator: (() => {
                    if( process.platform === 'darwin') {
                        return 'Command+Alt+Q';
                    }else {
                        return 'Ctrl+Alt+Q';
                    }
                })(),
                click() {
                    app.quit();
                }
            }
        ]
    }
]

if (process.platform === 'darwin') {
    menuTemplate.unshift({})
}

if ( process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            { role: 'reload' },
            { 
                label: 'Toogle Developer Tools',
                accelerator: (process.platform === 'darwin') ? 'Command+Alt+I' : 'Ctrl+Alt+I',
                click(item, focusedWindow) {
                    focusedWindow.openDevTools();
                }
            }
        ]
    });
}

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.on('closed', () => app.quit());
    mainWindow.loadURL(`file://${__dirname}/main.html`)

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
})

