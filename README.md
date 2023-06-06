# Project Automation Script

This script automates the creation of subfolders, execution of create-react-app, initialization of Node.js backend projects, and deletion of subfolders.

## Prerequisites

- Node.js (version X.X.X or higher)
- npm (version X.X.X or higher)

## Installation

1. Clone this repository or download the script file.
2. Open a terminal or command prompt.
3. Navigate to the directory where the script file is located.
4. Install the required dependencies by running the following command:


## Usage

1. Open the script file (`project_automation_script.js`) in a text editor.
2. Customize the script variables according to your requirements:
- `folders`: Specify the folders where you want to create subfolders, execute create-react-app, and initialize backend projects.
- `subfolders`: Specify the subfolders to create inside each folder.
- `subfolderToDelete`: Specify the subfolder name to delete or leave it empty to delete all subfolders.
3. Save the script file.
4. In a terminal or command prompt, navigate to the directory where the script file is located.
5. Run the script by executing the following command:


6. The script will perform the following actions:
- Create subfolders inside each specified folder if they don't exist.
- Execute create-react-app in the frontend subfolder of each specified folder if necessary.
- Initialize Node.js backend projects in the backend subfolder of each specified folder if necessary.
- Delete specified subfolders inside each folder if necessary.


