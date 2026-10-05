param([string]$CredentialFile, [switch]$BuildOnly)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$source = Join-Path $PSScriptRoot 'BackgroundTask.cs'
$directory = Join-Path $projectRoot '.cache/task-runner'
New-Item -ItemType Directory -Path $directory -Force | Out-Null
$hash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.Substring(0, 16).ToLowerInvariant()
$executable = Join-Path $directory "BackgroundTask-$hash.exe"
if (-not (Test-Path -LiteralPath $executable)) {
    # Windows PowerShell 5.1 targets the Windows-installed .NET Framework runtime.
    Add-Type -Path $source -OutputAssembly $executable -OutputType WindowsApplication
}
if ($BuildOnly) { $executable; exit 0 }
if (-not $CredentialFile) { throw 'CredentialFile is required to update task actions.' }
$CredentialFile = (Resolve-Path -LiteralPath $CredentialFile).Path
$logs = Join-Path $projectRoot '.cache/background'
New-Item -ItemType Directory -Path $logs -Force | Out-Null
$jobs = [ordered]@{
    'SecondLanguage-DailyCodex' = 'run-daily.ps1'
    'SecondLanguage-PracticeCodex' = 'run-practice.ps1'
    'SecondLanguage-ChapterQuestions' = 'run-questions.ps1'
    'SecondLanguage-PermanentArchive' = 'run-storage.ps1'
}
# Validate all existing tasks before changing any; never invent schedules or login settings.
$tasks = @{}
foreach ($name in $jobs.Keys) {
    $tasks[$name] = Get-ScheduledTask -TaskName $name -ErrorAction Stop
    if ($tasks[$name].Actions.Count -ne 1) { throw "Unexpected task actions: $name" }
}
$backup = Join-Path $directory (Get-Date -Format 'yyyyMMdd-HHmmss-ffff')
New-Item -ItemType Directory -Path $backup | Out-Null
foreach ($name in $jobs.Keys) {
    Export-ScheduledTask -TaskName $name | Out-File -LiteralPath (Join-Path $backup "$name.xml") -Encoding utf8
}
$changed = @()
try {
    foreach ($name in $jobs.Keys) {
        $script = Join-Path $PSScriptRoot $jobs[$name]
        # These resolved Windows file/directory paths cannot contain a quote.
        $arguments = '"{0}" "{1}" "{2}"' -f $script, $CredentialFile, $logs
        $action = New-ScheduledTaskAction -Execute $executable -Argument $arguments -WorkingDirectory $projectRoot
        Set-ScheduledTask -TaskName $name -Action $action | Out-Null
        $changed += $name
    }
} catch {
    foreach ($name in $changed) { Set-ScheduledTask -TaskName $name -Action $tasks[$name].Actions | Out-Null }
    throw
}
"Updated $($changed.Count) task actions; schedules and principals preserved. Backup: $backup"
