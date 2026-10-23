param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if ($projectRoot -notmatch '^D:\\') { throw 'Task runtime must physically reside on D:' }
$name = 'SecondLanguage-DailyCodex'
$task = Get-ScheduledTask -TaskName $name -ErrorAction Stop
if ($task.State -eq 'Running' -or $task.Triggers.Count -ne 1 -or $task.Triggers[0].DaysInterval -ne 1) { throw 'Expected one idle daily task; preserve unexpected/running task for inspection' }
if ($task.Actions[0].WorkingDirectory -ne $projectRoot) { throw 'Daily task points at another workspace' }
$at = [System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTimeOffset]::UtcNow, 'China Standard Time')
$boundary = $at.ToString('yyyy-MM-dd') + 'T05:00:00+08:00'
if (-not $Apply) { [pscustomobject]@{Task=$name;Current=$task.Triggers[0].StartBoundary;Target=$boundary}|ConvertTo-Json; exit 0 }
$backup = Join-Path $projectRoot ('.cache/daily-policy-release/schedule-' + $at.ToString('yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Path $backup -Force | Out-Null
Export-ScheduledTask -TaskName $name | Out-File -LiteralPath (Join-Path $backup 'before.xml') -Encoding utf8
$unchanged = @{Actions=($task.Actions|ConvertTo-Json -Depth 12 -Compress);Principal=($task.Principal|ConvertTo-Json -Depth 12 -Compress);Settings=($task.Settings|ConvertTo-Json -Depth 12 -Compress)}
$trigger = $task.Triggers[0]
$trigger.StartBoundary = $boundary
Set-ScheduledTask -TaskName $name -Trigger $trigger | Out-Null
$actual = Get-ScheduledTask -TaskName $name
foreach ($field in @('Actions','Principal','Settings')) {
  if (($actual.$field|ConvertTo-Json -Depth 12 -Compress) -ne $unchanged[$field]) { throw "Unexpected task change: $field; restore from $backup" }
}
$info = Get-ScheduledTaskInfo -TaskName $name
if ($actual.Triggers[0].StartBoundary -ne $boundary -or $info.NextRunTime.Hour -ne 5) { throw '05:00 schedule verification failed' }
Export-ScheduledTask -TaskName $name | Out-File -LiteralPath (Join-Path $backup 'after.xml') -Encoding utf8
$result = [pscustomobject]@{At=$at.ToString('o');Task=$name;StartBoundary=$actual.Triggers[0].StartBoundary;NextRunTime=$info.NextRunTime.ToString('o');Root=$projectRoot;ActionsPrincipalSettingsUnchanged=$true;Backup=$backup;TaskStarted=$false}
$result|ConvertTo-Json -Depth 4|Out-File -LiteralPath (Join-Path $backup 'result.json') -Encoding utf8
$result|ConvertTo-Json -Depth 4
