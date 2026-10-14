# Layout estimate only. Uses installed fonts; creates no files or rendered artwork.
Add-Type -AssemblyName System.Drawing
$lettering = 'THE SECOND LANGUAGE'
$inkHeightMM = 1.45
$trackingMM = 0.04
$diameterMM = 40
$rows = foreach ($fontName in @('Times New Roman','Palatino Linotype','Baskerville Old Face','Georgia')) {
    $family = New-Object System.Drawing.FontFamily($fontName)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    try {
        $path.AddString($lettering, $family, [int][System.Drawing.FontStyle]::Regular,
            [single]100, [System.Drawing.PointF]::new(0,0),
            [System.Drawing.StringFormat]::GenericTypographic)
        $bounds = $path.GetBounds()
        [pscustomobject]@{
            Font = $fontName
            UppercaseInkHeightMM = $inkHeightMM
            TrackingPerGapMM = $trackingMM
            ApproxOutlineWidthMM = [math]::Round(
                ($bounds.Width / $bounds.Height) * $inkHeightMM +
                ($lettering.Length - 1) * $trackingMM, 3)
            ThreePeriodMM = [math]::Round([math]::PI * $diameterMM / 3, 3)
            FourPeriodMM = [math]::Round([math]::PI * $diameterMM / 4, 3)
        }
    } finally {
        $path.Dispose()
        $family.Dispose()
    }
}
$rows | ConvertTo-Json
