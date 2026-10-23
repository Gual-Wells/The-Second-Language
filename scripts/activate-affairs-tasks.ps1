param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if ($projectRoot -notmatch '^D:\\') { throw 'Task runtime must physically reside on D:' }
$jobs = [ordered]@{'SecondLanguage-DailyCodex'='run-daily.ps1'}
$tasks = @{}
foreach ($name in $jobs.Keys) {
  $task = Get-ScheduledTask -TaskName $name -ErrorAction Stop
  if ($task.Actions.Count -ne 1) { throw "Unexpected actions: $name" }
  $quoted = [regex]::Matches($task.Actions[0].Arguments, '"([^"]*)"')
  if ($quoted.Count -ne 3 -or -not (Test-Path -LiteralPath $quoted[1].Groups[1].Value)) { throw "Unrecognized credential/path arguments: $name" }
  $tasks[$name] = @{Task=$task;Credential=$quoted[1].Groups[1].Value;Triggers=($task.Triggers|ConvertTo-Json -Depth 12 -Compress);Principal=($task.Principal|ConvertTo-Json -Depth 12 -Compress);Settings=($task.Settings|ConvertTo-Json -Depth 12 -Compress)}
}
if (-not $Apply) { @($jobs.Keys|ForEach-Object{[pscustomobject]@{Task=$_;CurrentRoot=$tasks[$_].Task.Actions[0].WorkingDirectory;TargetRoot=$projectRoot;WillStopRunningTask=$false}})|ConvertTo-Json -Depth 4; exit 0 }
$directory = Join-Path $projectRoot '.cache/task-runner'
New-Item -ItemType Directory -Path $directory -Force | Out-Null
$backup = Join-Path $directory ('affairs-switch-' + [DateTimeOffset]::UtcNow.ToString('yyyyMMdd-HHmmss-ffff'))
New-Item -ItemType Directory -Path $backup | Out-Null
foreach ($name in $jobs.Keys) { Export-ScheduledTask -TaskName $name | Out-File -LiteralPath (Join-Path $backup "$name.xml") -Encoding utf8 }
$launcher = & powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'install-background-tasks.ps1') -BuildOnly
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $launcher)) { throw 'Hidden background launcher unavailable' }
$logs = Join-Path $projectRoot '.cache/background'
New-Item -ItemType Directory -Path $logs -Force | Out-Null
$changed = @()
try {
  foreach ($name in $jobs.Keys) {
    $arguments = '"{0}" "{1}" "{2}"' -f (Join-Path $PSScriptRoot $jobs[$name]), $tasks[$name].Credential, $logs
    $action = New-ScheduledTaskAction -Execute $launcher -Argument $arguments -WorkingDirectory $projectRoot
    Set-ScheduledTask -TaskName $name -Action $action | Out-Null
    $changed += $name
    $actual = Get-ScheduledTask -TaskName $name
    if (($actual.Triggers|ConvertTo-Json -Depth 12 -Compress) -ne $tasks[$name].Triggers -or ($actual.Principal|ConvertTo-Json -Depth 12 -Compress) -ne $tasks[$name].Principal -or ($actual.Settings|ConvertTo-Json -Depth 12 -Compress) -ne $tasks[$name].Settings) { throw "Task schedule/principal/settings changed unexpectedly: $name" }
  }
} catch {
  foreach ($name in $changed) { Set-ScheduledTask -TaskName $name -Action $tasks[$name].Task.Actions | Out-Null }
  throw
}
$report = @{At=[DateTimeOffset]::UtcNow.ToString('o');Root=$projectRoot;Tasks=@($jobs.Keys);Backup=$backup;RunningTasksStopped=$false;NewSubscriptions=0}
$report|ConvertTo-Json -Depth 4|Out-File -LiteralPath (Join-Path $backup 'result.json') -Encoding utf8
$report|ConvertTo-Json -Depth 4
