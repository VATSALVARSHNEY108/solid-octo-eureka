$template = @'
import React from 'react';

export default function Lesson() {
  return (
    <div className="px-12 py-24">
      <h1 className="text-3xl font-bold">History of AI</h1>
      <p>Content coming soon.</p>
    </div>
  );
}
'@

Get-ChildItem -Path "C:/Users/VATSAL VARSHNEY/OneDrive/Desktop/CoreCode/content/artificial-intelligence" -Recurse -Filter *.tsx | ForEach-Object {
  Set-Content -Path $_.FullName -Value $template -Encoding UTF8
}
