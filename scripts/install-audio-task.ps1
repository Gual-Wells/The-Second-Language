param([string]$CredentialFile)
$ErrorActionPreference='Stop'
$root=(Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
if (-not $CredentialFile) { throw 'CredentialFile required' }
$CredentialFile=(Resolve-Path -LiteralPath $CredentialFile).Path
$template=Get-ScheduledTask -TaskName 'SecondLanguage-ChapterQuestions' -ErrorAction Stop
$executable=$template.Actions[0].Execute
if (-not (Test-Path -LiteralPath $executable)) { throw 'Hidden background runner unavailable' }
$script=Join-Path $PSScriptRoot 'run-audio.ps1'
$arguments='"{0}" "{1}" "{2}"' -f $script,$CredentialFile,(Join-Path $root '.cache/background')
$action=New-ScheduledTaskAction -Execute $executable -Argument $arguments -WorkingDirectory $root
$trigger=New-ScheduledTaskTrigger -Once -At (Get-Date).AddSeconds(10) -RepetitionInterval (New-TimeSpan -Minutes 1)
$settings=New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 4)
Register-ScheduledTask -TaskName 'SecondLanguage-AudioPreparation' -Action $action -Trigger $trigger -Settings $settings -Principal $template.Principal -Description 'Confirmed chapter audio preparation; hidden, model-free monitoring; paid synthesis only for requested units.' -Force | Out-Null
'Hidden audio monitor installed; checks every minute, other task schedules unchanged.'
