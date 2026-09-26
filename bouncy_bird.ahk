; Launches the Flappy Bird Electron app
#RequiresAutoHotkey v2.0

; Change this to your actual project path!
projectPath := "C:\Users\ruben\GithubStuff\bouncy_bird"

; Opens a Command Prompt window, cds to the project, and runs npm start
Run('cmd.exe /k "cd /d "' projectPath ' " && npm start"')