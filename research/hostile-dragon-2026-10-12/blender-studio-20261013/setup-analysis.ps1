param([string]$BasePython = 'C:\Python314\python.exe')
$ErrorActionPreference='Stop'
$studioRoot=$PSScriptRoot
$env:TEMP="$studioRoot\tmp"
$env:TMP=$env:TEMP
$env:PIP_CACHE_DIR="$studioRoot\cache\pip"
$env:PYTHONPYCACHEPREFIX="$studioRoot\cache\pycache"
foreach ($folder in @('tmp','cache\pip','cache\pycache')) { New-Item -ItemType Directory -Path "$studioRoot\$folder" -Force | Out-Null }
$venvPython="$studioRoot\analysis-venv\Scripts\python.exe"
if (-not (Test-Path -LiteralPath $venvPython)) {
    if (-not (Test-Path -LiteralPath $BasePython)) { throw 'Supply an existing base Python interpreter; do not install dependencies on C.' }
    & $BasePython -m venv "$studioRoot\analysis-venv"
    if ($LASTEXITCODE -ne 0) { throw 'Venv creation failed' }
    & $venvPython -m pip install --index-url https://pypi.org/simple -r "$studioRoot\requirements-lock.txt"
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed' }
}
& $venvPython -c "import mcp, trimesh, scipy, manifold3d; import importlib.metadata as m; print({k:m.version(k) for k in ['mcp','trimesh','scipy','manifold3d']})"
if ($LASTEXITCODE -ne 0) { throw 'Existing venv is incomplete; repair with the locked requirements.' }
