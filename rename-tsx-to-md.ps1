Get-ChildItem -Path 'C:/Users/VATSAL VARSHNEY/OneDrive/Desktop/O(1)/content/operating-system' -Recurse -Filter *.tsx |
  ForEach-Object {
    $old = $_.FullName
    $new = $old -replace '\\.tsx$', '.md'
    Rename-Item -LiteralPath $old -NewName $new -Force
  }
