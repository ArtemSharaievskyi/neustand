param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$ScannerArguments
)

$ErrorActionPreference = "Stop"
$version = "2.6.0"
$expectedSha256 = "e0ed7644118b717b028c249ee9d3515024e55e8510747ca08906eb96765354d6"
$toolDirectory = Join-Path $env:LOCALAPPDATA "NEUSTAND\tools\osv-scanner\v$version"
$scannerPath = Join-Path $toolDirectory "osv-scanner.exe"
$downloadUrl = "https://github.com/google/osv-scanner/releases/download/v$version/osv-scanner_windows_amd64.exe"

if (-not (Test-Path -LiteralPath $scannerPath -PathType Leaf)) {
  New-Item -ItemType Directory -Force -Path $toolDirectory | Out-Null
  $temporaryPath = [System.IO.Path]::GetTempFileName()
  try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $temporaryPath
    $actualSha256 = (Get-FileHash -LiteralPath $temporaryPath -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actualSha256 -ne $expectedSha256) {
      throw "OSV-Scanner $version checksum mismatch: $actualSha256"
    }
    Move-Item -LiteralPath $temporaryPath -Destination $scannerPath
  }
  finally {
    if (Test-Path -LiteralPath $temporaryPath) {
      Remove-Item -LiteralPath $temporaryPath -Force
    }
  }
}

$installedSha256 = (Get-FileHash -LiteralPath $scannerPath -Algorithm SHA256).Hash.ToLowerInvariant()
if ($installedSha256 -ne $expectedSha256) {
  throw "Installed OSV-Scanner $version checksum mismatch: $installedSha256"
}

& $scannerPath @ScannerArguments
exit $LASTEXITCODE
