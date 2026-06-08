$base = 'C:/Users/VATSAL VARSHNEY/OneDrive/Desktop/O(1)/content/database-management-system'
$structure = @{
    introduction = @('introduction-to-dbms','characteristics-of-dbms','advantages-of-dbms','disadvantages-of-dbms','database-users','database-administrator','database-architecture','three-schema-architecture','data-independence','types-of-databases','centralized-vs-distributed-db','dbms-vs-file-system')
    'entity-relationship-model' = @('entity-relationship-model','entities-and-attributes','relationships','cardinality-constraints','participation-constraints','weak-entity-set','strong-entity-set','er-diagram-basics','specialization','generalization','aggregation')
    'relational-model' = @('relational-model-introduction','relation-schema','keys-in-dbms','super-key','candidate-key','primary-key','foreign-key','alternate-key','composite-key','relational-algebra','select-operation','project-operation','join-operation','union-intersection-set-difference','cartesian-product','relational-calculus','integrity-constraints')
    sql = @('introduction-to-sql','sql-data-types','create-database','create-table','alter-table','drop-table','insert-query','update-query','delete-query','select-query','where-clause','order-by-clause','group-by-clause','having-clause','joins-in-sql','inner-join','left-right-full-join','nested-queries','views-in-sql','indexes-in-sql','triggers','stored-procedures','functions-in-sql','cursors','sql-practice-queries')
    normalization = @('normalization-introduction','functional-dependency','trivial-functional-dependency','closure-of-attributes','armstrong-axioms','minimal-cover','first-normal-form','second-normal-form','third-normal-form','boyce-codd-normal-form','fourth-normal-form','fifth-normal-form','multivalued-dependency','join-dependency','lossless-decomposition','dependency-preserving-decomposition','denormalization')
    'transactions-and-concurrency' = @('transaction-introduction','acid-properties','transaction-states','concurrent-execution','serializability','conflict-serializability','view-serializability','lock-based-protocols','two-phase-locking','timestamp-protocol','deadlock-in-dbms','deadlock-prevention-dbms','deadlock-detection-dbms','recovery-techniques','log-based-recovery','checkpoints','shadow-paging','distributed-transactions')
    'indexing-and-hashing' = @('indexing-introduction','ordered-indexing','primary-index','secondary-index','clustered-index','dense-vs-sparse-index','multilevel-index','b-tree','b-plus-tree','hashing-techniques','static-hashing','dynamic-hashing','extendible-hashing','linear-hashing','index-sequential-file')
    'query-processing-and-optimization' = @('query-processing','parsing-and-translation','query-evaluation','query-optimization','heuristic-optimization','cost-based-optimization','join-order-optimization','execution-plans','statistics-in-query-optimization','pipelining','materialization','query-performance-tuning')
    'storage-and-file-organization' = @('storage-system-overview','file-organization','heap-files','sequential-files','hashing-file-organization','record-storage','buffer-management','page-replacement-algorithms-db','disk-storage-structure','raid-in-dbms','storage-allocation','physical-data-storage')
    'distributed-db-and-nosql' = @('distributed-dbms','distributed-database-architecture','fragmentation-in-distributed-db','replication','cap-theorem','nosql-introduction','key-value-databases','document-databases','column-oriented-databases','graph-databases','mongodb-basics','cassandra-basics','firebase-basics')
    'database-security' = @('database-security-introduction','authentication-in-dbms','authorization-in-dbms','access-control','sql-injection','encryption-in-dbms','backup-and-recovery','auditing','data-privacy','database-security-best-practices')
    'advanced-topics' = @('object-oriented-dbms','object-relational-dbms','temporal-databases','multimedia-databases','data-warehousing','data-mining','olap-vs-oltp','big-data-introduction','hadoop-basics','spark-basics','blockchain-databases','cloud-databases')
    'database-engines' = @('mysql-architecture','postgresql-internals','sqlite-overview','oracle-db-architecture','sql-server-overview','mariadb-vs-mysql')
}
foreach($folder in $structure.Keys){
    $folderPath = Join-Path $base $folder
    New-Item -ItemType Directory -Force -Path $folderPath | Out-Null
    foreach($lesson in $structure[$folder]){
        $filePath = Join-Path $folderPath ($lesson + '.tsx')
        New-Item -ItemType File -Force -Path $filePath | Out-Null
    }
}
