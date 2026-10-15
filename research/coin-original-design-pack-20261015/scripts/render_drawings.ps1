param([string]$Root = (Split-Path -Parent $PSScriptRoot))
$ErrorActionPreference='Stop'
$runtime='D:\CodexStorage\workspaces\ai3d-design-research\coin-pack-runtime'
$env:TEMP=Join-Path $runtime 'tmp'
$env:TMP=$env:TEMP
$chrome='C:\Program Files\Google\Chrome\Application\chrome.exe'
$logs=Join-Path $runtime 'render-logs'
New-Item -ItemType Directory -Force -Path $logs | Out-Null
$selected=if($env:TSL_DRAWING_FILTER){Get-ChildItem -LiteralPath (Join-Path $Root 'drawings') -Filter $env:TSL_DRAWING_FILTER}else{Get-ChildItem -LiteralPath (Join-Path $Root 'drawings') -Filter '*.svg'}
foreach($file in $selected){
    $target=Join-Path $file.DirectoryName ($file.BaseName+'.png')
    $args=@('--headless=new','--disable-gpu','--disable-extensions','--disable-background-networking','--no-first-run','--no-default-browser-check','--disable-crash-reporter','--hide-scrollbars','--force-device-scale-factor=1','--window-size=1800,1200','--virtual-time-budget=1800',"--user-data-dir=$runtime\chrome-design-profile","--disk-cache-dir=$runtime\chrome-cache","--crash-dumps-dir=$runtime\crash","--screenshot=$target",('file:///'+$file.FullName.Replace('\','/')))
    $proc=Start-Process -FilePath $chrome -ArgumentList $args -WindowStyle Hidden -PassThru -RedirectStandardError (Join-Path $logs ($file.BaseName+'.stderr.txt'))
    if(-not $proc.WaitForExit(45000)){throw "Own renderer timeout PID $($proc.Id), inspect its command line before cleanup."}
    if($proc.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $target)){throw "Render failed $($file.Name)"}
    Write-Output $target
}

