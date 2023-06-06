const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const folders = ["project1", "project2"];
const subfolders = ["frontend", "backend"];

//specify the subfolder name to delete or leave it empty to delete all subfolders
const subfolderToDelete = '';

const frontendCheckNecessaryFiles = (frontendFolderPath) => {
    const necessaryFiles = ['package.json', 'src/index.js', 'public/index.html'];
    return necessaryFiles.every(file => fs.existsSync(path.join(frontendFolderPath, file)));
}

const backendCheckNecessaryFiles = (backendFolderPath) => {
    const necessaryFiles = ['package.json', 'App.js', 'node_modules'];
    return necessaryFiles.every(file => fs.existsSync(path.join(backendFolderPath, file)));
}

// function to create subfolders inseide each folder
const createMultiSubfolders = () => {
    const promises = [];
    folders.forEach(folder => {
        subfolders.forEach((subfolder) => {
            const subfolderPath = path.join(folder, subfolder);
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (fs.existsSync(subfolderPath)) {
                        console.log(`Folder '${subfolder}' already exists inside '${folder}'. Skipping creation.`);
                        resolve();
                    } else {
                        fs.mkdir(subfolderPath, { recursive: true }, error => {
                            if (error) {
                                console.error(`Failed to create subfolder '${subfolder}' inside '${folder}'.`, error);
                                reject(error);
                            } else {
                                console.log(`Created subfolder '${subfolder}' inside '${folder}'.`);
                                resolve();
                            }
                        });
                    }
                }, 3000)
            });
            promises.push(promise);
        });
    });
    return Promise.all(promises)
}

//function to delete subfolders inside each folder
const deleteSubfolders = (subfolderName) => {
    const promises = [];
    folders.forEach((folder) => {
        const folderPath = path.join(__dirname, folder);
        //get the list of subfolders inside the folder
        const subfolders = fs.readdirSync(folderPath);
        //loop over each subfolder and delete it
        subfolders.forEach((subfolder) => {
            const subfolderPath = path.join(folderPath, subfolder);
            const isDirectory = fs.lstatSync(subfolderPath).isDirectory();
            if (isDirectory && (subfolder === subfolderName || !subfolderName)) {
                const promise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        fs.rm(subfolderPath, { recursive: true }, error => {
                            if (error) {
                                console.error(`Failed to delete subfolder '${subfolder}' inside '${folder}'.`, error);
                                reject();
                            } else {
                                console.log(`Deleted subfolder '${subfolder}' inside '${folder}'.`);
                                resolve();
                            }
                        })
                    }, 3000);
                })
                promises.push(promise);
            }

        })
    });
    return Promise.all(promises);
}

//function to run create-ract-app
const runCreateReactApp = () => {
    const promises = [];
    folders.forEach((folder) => {
        const frontendFolderPath = path.join(__dirname, folder, 'frontend');

        if (fs.existsSync(frontendFolderPath) && frontendCheckNecessaryFiles(frontendFolderPath)) {
            console.log(`Skipping create-react-app execution in '${folder}/frontend'. Folder already exists and contains necessary files.`);
            promises.push(Promise.resolve()); //resolves immediately
        } else {
            //run create-react-app
            const createReactAppCommand = 'npx create-react-app .';

            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        execSync(createReactAppCommand, { cwd: frontendFolderPath, stdio: 'inherit' });
                        console.log(`create-react-app executed successfully in '${folder}/frontend'`);
                        resolve();
                    } catch (error) {
                        console.error(`Error running create-react-app in '${folder}/frontend': ${error}`);
                        reject(error);
                    }
                }, 3000)
            });
            promises.push(promise);
        }
    })
    return Promise.all(promises);
}

const initializeBackendProject = () => {
    const promises = [];
    folders.map((folder) => {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const backendFolderPath = path.join(__dirname, folder, 'backend');

                //if backend subfolder exists we can skip
                if (fs.existsSync(backendFolderPath) && backendCheckNecessaryFiles(backendFolderPath)) {
                    console.log(`Skipping initialization of Node.js backend project in '${folder}/backend'. Folder already exists.`);
                    resolve();
                } else {
                    console.log(`Initializing Node.js backend project in '${folder}/backend'...`);
                    // navigate into the backend subfolder
                    process.chdir(backendFolderPath);

                    if (!fs.existsSync(path.join(backendFolderPath, "package.json"))) {
                        //initialize a new node.js project
                        execSync('npm init -y', { stdio: 'inherit' });
                    }

                    //intall dependencies ex. express or any other
                    execSync('npm install express', { stdio: 'inherit' });

                    //to read the server code from a reparate file
                    const serverCodeFilePath = path.join(__dirname, 'server.js');
                    const serverCode = fs.readFileSync(serverCodeFilePath, 'utf-8');

                    //create app.js file with the server code
                    fs.writeFileSync(path.join(backendFolderPath, 'App.js'), serverCode);
                    console.log(`Node.js backend project initialized successfully in '${folder}/backend'`);

                    // read the package.json file
                    const packageJsonPath = path.join(backendFolderPath, 'package.json');
                    const packageJsonData = fs.readFileSync(packageJsonPath, 'utf-8');
                    const packageJson = JSON.parse(packageJsonData);

                    // add the start script to the package.json
                    packageJson.scripts = packageJson.scripts || {};
                    packageJson.scripts.start = "node App.js";

                    // write the modified package.json back to the file
                    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
                    console.log(`Added "start" script to package.json in '${folder}/backend'`);
                    resolve();
                }

            })
        })
        promises.push(promise)
    })
    return Promise.all(promises)

}






createMultiSubfolders()
    .then(() => {
        console.log('***** Subfolders created successfully or already exist.*****');
    })
    .then(() => {
        console.log('***** create-react-app executions completed successfully or skipped. ***** ');
        return runCreateReactApp();
    })
    .then(() => {
        console.log('***** Backend projects initialized successfully or skipped. ***** ');
        return initializeBackendProject();
    })
    .then(() => {
        console.log('***** Deleted folder(s) successfully or skipped. *****');
        deleteSubfolders(subfolderToDelete);
    })
    .catch((error) => {
        console.error('Error:', error);
    });