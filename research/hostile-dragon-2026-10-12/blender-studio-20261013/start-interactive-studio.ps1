param([string]$ResumeFile = '')
$studioRoot = 'D:\CodexStorage\workspaces\hostile-dragon-coin\studio-20261013'
$blenderExecutable = 'D:\CodexStorage\tools\blender-5.1.2-windows-x64\blender.exe'
$pidFile = "$studioRoot\outputs\interactive-process-id.txt"
if (Test-Path -LiteralPath $pidFile) {
    $ownedId = [int](Get-Content -LiteralPath $pidFile -Raw)
    $existingStudio = Get-CimInstance Win32_Process -Filter "ProcessId=$ownedId" -ErrorAction SilentlyContinue
    if ($existingStudio -and $existingStudio.ExecutablePath -eq $blenderExecutable -and $existingStudio.CommandLine.Contains("$studioRoot\start-interactive-studio.py")) {
        Write-Output "Task-owned studio is already running: $ownedId. Use the command client to edit its current scene."
        exit 0
    }
}
$listener = Get-NetTCPConnection -LocalPort 9879 -State Listen -ErrorAction SilentlyContinue
if ($listener) { throw 'Port 9879 is occupied by another process; refusing to replace it.' }
if ($ResumeFile) {
    $resolvedResume = (Resolve-Path -LiteralPath $ResumeFile).Path
    if (-not $resolvedResume.StartsWith("$studioRoot\outputs\",[System.StringComparison]::OrdinalIgnoreCase) -or [IO.Path]::GetExtension($resolvedResume) -ne '.blend') { throw 'Resume only a saved task-owned .blend.' }
    $env:COIN_STUDIO_RESUME=$resolvedResume
} else { $env:COIN_STUDIO_RESUME='' }
$env:TEMP = "$studioRoot\tmp"
$env:TMP = $env:TEMP
$env:BLENDER_USER_CONFIG = "$studioRoot\config\config"
$env:BLENDER_USER_SCRIPTS = "$studioRoot\config\scripts"
$env:BLENDER_USER_DATAFILES = "$studioRoot\config\datafiles"
$env:BLENDER_USER_EXTENSIONS = "$studioRoot\config\extensions"
$env:PYTHONPYCACHEPREFIX = "$studioRoot\cache\pycache"
$blenderStudioProcess = Start-Process -FilePath $blenderExecutable -ArgumentList @('--factory-startup','--online-mode','--no-window-focus','--python',"$studioRoot\start-interactive-studio.py") -WindowStyle Hidden -RedirectStandardOutput "$studioRoot\logs\interactive-stdout.log" -RedirectStandardError "$studioRoot\logs\interactive-stderr.log" -PassThru
$blenderStudioProcess.Id | Set-Content -LiteralPath "$studioRoot\outputs\interactive-process-id.txt"
Write-Output "Started task-owned Blender process $($blenderStudioProcess.Id)"
