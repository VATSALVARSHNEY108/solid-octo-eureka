$base = "C:/Users/VATSAL VARSHNEY/OneDrive/Desktop/O(1)/content/database-management-system"

$dirMap = @{
  "introduction" = "01-introduction"
  "entity-relationship-model" = "02-entity-relationship-model"
  "relational-model" = "03-relational-model"
  "sql" = "04-sql"
  "normalization" = "05-normalization"
  "transactions-and-concurrency" = "06-transactions-and-concurrency"
  "indexing-and-hashing" = "07-indexing-and-hashing"
  "query-processing-and-optimization" = "08-query-processing-and-optimization"
  "storage-and-file-organization" = "09-storage-and-file-organization"
  "distributed-db-and-nosql" = "10-distributed-db-and-nosql"
  "database-security" = "11-database-security"
  "advanced-topics" = "12-advanced-topics"
  "database-engines" = "13-database-engines"
}

foreach ($old in $dirMap.Keys) {
  $new = $dirMap[$old]
  $oldPath = Join-Path $base $old
  $newPath = Join-Path $base $new
  if (Test-Path $oldPath) {
    Rename-Item -Path $oldPath -NewName $new -Force
  }
}

$fileMap = @{
  "introduction-to-dbms.tsx" = "01-introduction-to-dbms.tsx"
  "characteristics-of-dbms.tsx" = "02-characteristics-of-dbms.tsx"
  "advantages-of-dbms.tsx" = "03-advantages-of-dbms.tsx"
  "disadvantages-of-dbms.tsx" = "04-disadvantages-of-dbms.tsx"
  "database-users.tsx" = "05-database-users.tsx"
  "database-administrator.tsx" = "06-database-administrator.tsx"
  "database-architecture.tsx" = "07-database-architecture.tsx"
  "three-schema-architecture.tsx" = "08-three-schema-architecture.tsx"
  "data-independence.tsx" = "09-data-independence.tsx"
  "types-of-databases.tsx" = "10-types-of-databases.tsx"
  "centralized-vs-distributed-db.tsx" = "11-centralized-vs-distributed-db.tsx"
  "dbms-vs-file-system.tsx" = "12-dbms-vs-file-system.tsx"
}

$introPath = Join-Path $base "01-introduction"
foreach ($f in $fileMap.Keys) {
  $oldFile = Join-Path $introPath $f
  $newFile = Join-Path $introPath $fileMap[$f]
  if (Test-Path $oldFile) {
    Rename-Item -Path $oldFile -NewName $fileMap[$f] -Force
  }
}
