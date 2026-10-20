$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$assetRoot = Join-Path $taskRoot 'web/labs/scroll-museum-v1/assets'
New-Item -ItemType Directory -Path $assetRoot -Force | Out-Null
$proxy = 'http://127.0.0.1:6987'
$sources = @()
foreach ($entry in @(@{id='wood_table_worn';prefix='scene-wood'},@{id='stone_wall_03';prefix='scene-stone'})) {
  $api = Invoke-RestMethod -Uri "https://api.polyhaven.com/files/$($entry.id)" -Proxy $proxy
  foreach ($map in @(@{kind='Diffuse';suffix='color'},@{kind='nor_gl';suffix='normal'},@{kind='Rough';suffix='roughness'})) {
    $file = $api.($map.kind).'1k'.jpg
    $name = "$($entry.prefix)-$($map.suffix).jpg"
    $target = Join-Path $assetRoot $name
    if (!(Test-Path -LiteralPath $target)) { Invoke-WebRequest -Uri $file.url -Proxy $proxy -OutFile $target }
    if ((Get-FileHash -LiteralPath $target -Algorithm MD5).Hash.ToLower() -ne $file.md5) { throw "Source digest mismatch: $name" }
    $sources += @{file=$name;source=$file.url;asset="https://polyhaven.com/a/$($entry.id)";license='CC0-1.0';bytes=(Get-Item -LiteralPath $target).Length;sha256=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower()}
  }
}
$api = Invoke-RestMethod -Uri 'https://api.polyhaven.com/files/WoodenTable_01' -Proxy $proxy
$gltf = $api.gltf.'1k'.gltf
$tableRoot = Join-Path $assetRoot 'scene-table'
New-Item -ItemType Directory -Path (Join-Path $tableRoot 'textures') -Force | Out-Null
$files = @(@{key='WoodenTable_01_1k.gltf';value=$gltf})
foreach ($property in $gltf.include.PSObject.Properties) { $files += @{key=$property.Name;value=$property.Value} }
foreach ($file in $files) {
  $target = Join-Path $tableRoot $file.key
  if (!(Test-Path -LiteralPath $target)) { Invoke-WebRequest -Uri $file.value.url -Proxy $proxy -OutFile $target }
  if ((Get-FileHash -LiteralPath $target -Algorithm MD5).Hash.ToLower() -ne $file.value.md5) { throw "Source digest mismatch: $($file.key)" }
  $sources += @{file="scene-table/$($file.key)";source=$file.value.url;asset='https://polyhaven.com/a/WoodenTable_01';license='CC0-1.0';bytes=(Get-Item -LiteralPath $target).Length;sha256=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash.ToLower()}
}
@{generatedAt=[DateTime]::UtcNow.ToString('o');purpose='Scroll museum architectural study; no formal collection issued';license='https://polyhaven.com/license';files=$sources} | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $assetRoot 'scene-sources.json') -Encoding utf8
Write-Output "Verified $($sources.Count) CC0 source files; $([Math]::Round(($sources | Measure-Object -Property bytes -Sum).Sum / 1MB,2)) MiB total."
