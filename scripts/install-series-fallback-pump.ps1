param(
    [string]$ConfigFile = 'D:\CodexStorage\services\second-series-fallback\config.json',
    [switch]$Apply,
    [switch]$Start
)
$ErrorActionPreference = 'Stop'
if ($Start -and -not $Apply) { throw '-Start requires -Apply.' }
$configPath = (Resolve-Path -LiteralPath $ConfigFile).ProviderPath
if ($configPath -notmatch '^D:\\') { throw 'Configuration must be physically stored on D:.' }
$config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
$serviceRoot = [IO.Path]::GetFullPath($config.workRoot)
if ($serviceRoot -notmatch '^D:\\') { throw 'Service files must be on D:.' }
$pump = Join-Path $PSScriptRoot 'series-fallback-pump.mjs'
$node = [IO.Path]::GetFullPath($config.nodeExecutable)
if (-not (Test-Path -LiteralPath $node -PathType Leaf)) { throw 'Node executable is unavailable.' }
$env:TEMP = Join-Path $serviceRoot 'tmp'
$env:TMP = $env:TEMP
New-Item -ItemType Directory -Path $env:TEMP -Force | Out-Null
& $node $pump --config $configPath --check
if ($LASTEXITCODE -ne 0) { throw 'Pump configuration validation failed; no task changed.' }
$taskName = 'Second-Series-Codex-Fallback'
$launcher = Join-Path $serviceRoot 'run-hidden.vbs'
$wscript = Join-Path $env:WINDIR 'System32\wscript.exe'
$user = [Security.Principal.WindowsIdentity]::GetCurrent().Name
if (-not $Apply) {
    [pscustomobject]@{Status='ValidatedNotInstalled'; Task=$taskName; IntervalSeconds=15; Projects=$config.projects.Count; Launcher=$launcher; ModelCalls=0; NetworkRequests=0} | ConvertTo-Json
    return
}
# Protect only this dedicated executor directory, not project folders or siblings.
New-Item -ItemType Directory -Path $serviceRoot -Force | Out-Null
& icacls $serviceRoot /inheritance:r /grant:r "${user}:(OI)(CI)F" 'SYSTEM:(OI)(CI)F' | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Could not protect the service directory; task not registered.' }
$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing -and $existing.State -eq 'Running') { throw 'The existing executor is running. Finish its task before changing this installation.' }
if ($existing) {
    $backupPath = Join-Path $serviceRoot ('task-before-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.xml')
    Export-ScheduledTask -TaskName $taskName | Set-Content -LiteralPath $backupPath -Encoding utf8
}
function VbsString([string]$value) { return '"' + $value.Replace('"', '""') + '"' }
function QuoteArgument([string]$value) {
    if ($value.Contains('"') -or $value.Contains("`r") -or $value.Contains("`n")) { throw 'Invalid launcher argument.' }
    return '"' + $value + '"'
}
$commandLine = (QuoteArgument $node) + ' --use-env-proxy ' + (QuoteArgument $pump) + ' --config ' + (QuoteArgument $configPath)
$content = @(
    'Option Explicit',
    'Dim sh, code',
    'Set sh = CreateObject("WScript.Shell")',
    ('sh.CurrentDirectory = ' + (VbsString $serviceRoot)),
    ('sh.Environment("Process")("TEMP") = ' + (VbsString $env:TEMP)),
    ('sh.Environment("Process")("TMP") = ' + (VbsString $env:TMP)),
    ('code = sh.Run(' + (VbsString $commandLine) + ', 0, True)'),
    'WScript.Quit code'
)
[IO.File]::WriteAllLines($launcher, $content, [Text.Encoding]::Unicode)
$action = New-ScheduledTaskAction -Execute $wscript -Argument ('//B //Nologo ' + (QuoteArgument $launcher)) -WorkingDirectory $serviceRoot
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $user
$settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Limited
$task = New-ScheduledTask -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Hidden local Codex fallback executor. Status-only checks; no model call while queues are idle.'
Register-ScheduledTask -TaskName $taskName -InputObject $task -Force | Out-Null
if ($Start) { Start-ScheduledTask -TaskName $taskName }
[pscustomobject]@{Status=$(if ($Start) {'RegisteredAndStarted'} else {'RegisteredNotStarted'}); Task=$taskName; IntervalSeconds=15; Projects=$config.projects.Count; ModelCalls=0} | ConvertTo-Json
