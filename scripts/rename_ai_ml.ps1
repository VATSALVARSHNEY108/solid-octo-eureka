$base = 'C:/Users/VATSAL VARSHNEY/OneDrive/Desktop/O(1)/content'

# Function to rename items in a directory with numeric prefixes based on sorted order
function Add-Prefix {
    param(
        [string]$parentPath
    )
    $items = Get-ChildItem -Path $parentPath | Sort-Object Name
    $index = 1
    foreach ($item in $items) {
        $prefix = $index.ToString('D2')
        $newName = "${prefix}_$($item.Name)"
        $newPath = Join-Path $parentPath $newName
        Rename-Item -Path $item.FullName -NewName $newName -Force
        # If it is a directory, recurse into it (for machine-learning subfolders)
        if ($item.PSIsContainer) {
            Add-Prefix -parentPath $newPath
        }
        $index++
    }
}

# Rename subfolders under artificial-intelligence
$aiPath = Join-Path $base 'artificial-intelligence'
Add-Prefix -parentPath $aiPath

Write-Host 'AI and ML folders renamed with numeric prefixes.'
