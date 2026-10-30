param([Parameter(Mandatory=$true)][ValidateSet('second-language','second-algorithm')][string]$Project,[Parameter(Mandatory=$true)][string]$ProjectRoot,[switch]$Apply)
$ErrorActionPreference='Stop'
$ProjectRoot=(Resolve-Path -LiteralPath $ProjectRoot).Path
if($ProjectRoot -notmatch '^D:\\'){throw 'API runtime must physically reside on D:'}
$source=Join-Path $PSScriptRoot 'ApiBackgroundTask.cs'
$directory=Join-Path (Split-Path -Parent $PSScriptRoot) '.cache/api-runner'
New-Item -ItemType Directory -Path $directory -Force | Out-Null
$env:TEMP=$directory;$env:TMP=$directory
$digest=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.Substring(0,16).ToLowerInvariant()
$launcher=Join-Path $directory "ApiBackgroundTask-$digest.exe"
if(-not(Test-Path -LiteralPath $launcher)){Add-Type -Path $source -OutputAssembly $launcher -OutputType WindowsApplication}
$runner=Join-Path $ProjectRoot 'scripts/question-api-worker.mjs'
if(-not(Test-Path -LiteralPath $runner)){throw 'Missing API question runner'}
$node=(Get-Command node -ErrorAction Stop).Source
$logs=Join-Path $ProjectRoot $(if($Project -eq 'second-language'){'.cache/api-background'}else{'.local/services/api-background'})
New-Item -ItemType Directory -Path $logs -Force | Out-Null
$name=if($Project -eq 'second-language'){'SecondLanguage-APIQuestions'}else{'SecondAlgorithm-APIQuestions'}
if(-not $Apply){[pscustomobject]@{Task=$name;Runner=$runner;Launcher=$launcher;Applied=$false}|ConvertTo-Json;exit 0}
$existing=Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue
if($existing -and $existing.State -eq 'Running'){throw 'Preserve running task; activate only while idle'}
if($existing){Export-ScheduledTask -TaskName $name | Out-File -LiteralPath (Join-Path $directory ($name+'.before.xml')) -Encoding utf8}
$arguments='"{0}" "{1}" "{2}"' -f $node,$runner,$logs
$action=New-ScheduledTaskAction -Execute $launcher -Argument $arguments -WorkingDirectory $ProjectRoot
$trigger=New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration (New-TimeSpan -Days 3650)
$principal=New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
$settings=New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 20)
Register-ScheduledTask -TaskName $name -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Private API chapter questions; silent queue check, no model on empty queue.' -Force | Out-Null
[pscustomobject]@{Task=$name;Runner=$runner;Applied=$true;LegacyTasksChanged=$false}|ConvertTo-Json
