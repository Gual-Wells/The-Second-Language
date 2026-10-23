param([string]$CredentialFile,[switch]$RefreshArchive)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$runtimeTemp = Join-Path $projectRoot '.cache/runtime-temp'
New-Item -ItemType Directory -Force -Path $runtimeTemp | Out-Null
$env:TEMP = $runtimeTemp
$env:TMP = $runtimeTemp
if (-not $CredentialFile) {
 $config = Get-Content -LiteralPath (Join-Path $projectRoot '.cache/local-services.json') -Raw | ConvertFrom-Json
 $CredentialFile = $config.publisherCredentialFile
}
$CredentialFile = (Resolve-Path -LiteralPath $CredentialFile).Path
$launcher = & (Join-Path $PSScriptRoot 'install-background-tasks.ps1') -BuildOnly
$logs = Join-Path $projectRoot '.cache/background'
New-Item -ItemType Directory -Force -Path $logs | Out-Null
$arguments = '"{0}" "{1}" "{2}"' -f (Join-Path $PSScriptRoot 'run-scroll.ps1'),$CredentialFile,$logs
$action = New-ScheduledTaskAction -Execute $launcher -Argument $arguments -WorkingDirectory $projectRoot
$existing = Get-ScheduledTask -TaskName 'SecondLanguage-ScrollProduction' -ErrorAction SilentlyContinue
if ($existing) {
 Set-ScheduledTask -TaskName $existing.TaskName -Action $action | Out-Null
} else {
 # Reuse the existing owner's one-minute interactive task trigger and identity.
 $reference = Get-ScheduledTask -TaskName 'SecondLanguage-ChapterQuestions' -ErrorAction Stop
 $settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 3) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
 $definition = New-ScheduledTask -Action $action -Trigger $reference.Triggers -Principal $reference.Principal -Settings $settings -Description 'Produce explicitly requested chapter keepsakes; an idle queue invokes no model.'
 Register-ScheduledTask -TaskName 'SecondLanguage-ScrollProduction' -InputObject $definition | Out-Null
}
if ($RefreshArchive) {
 $archive = Get-ScheduledTask -TaskName 'SecondLanguage-PermanentArchive' -ErrorAction Stop
 if ($archive.State -eq 'Running') { throw 'Archive is running. Preserve it and update the action after completion.' }
 $backup = Join-Path $projectRoot ('.cache/task-runner/archive-' + (Get-Date -Format 'yyyyMMdd-HHmmss-ffff') + '.xml')
 Export-ScheduledTask -TaskName $archive.TaskName | Out-File -LiteralPath $backup -Encoding utf8
 $arguments = '"{0}" "{1}" "{2}"' -f (Join-Path $PSScriptRoot 'run-storage.ps1'),$CredentialFile,$logs
 Set-ScheduledTask -TaskName $archive.TaskName -Action (New-ScheduledTaskAction -Execute $launcher -Argument $arguments -WorkingDirectory $projectRoot) | Out-Null
}
'Hidden scroll task installed; existing credentials, schedules and project data preserved.'
