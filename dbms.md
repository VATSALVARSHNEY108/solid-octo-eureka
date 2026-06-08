dbms/
├── introduction/
│   ├── introduction-to-dbms.tsx
│   ├── characteristics-of-dbms.tsx
│   ├── advantages-of-dbms.tsx
│   ├── disadvantages-of-dbms.tsx
│   ├── database-users.tsx
│   ├── database-administrator.tsx
│   ├── database-architecture.tsx
│   ├── three-schema-architecture.tsx
│   ├── data-independence.tsx
│   ├── types-of-databases.tsx
│   ├── centralized-vs-distributed-db.tsx
│   └── dbms-vs-file-system.tsx
│
├── entity-relationship-model/
│   ├── entity-relationship-model.tsx
│   ├── entities-and-attributes.tsx
│   ├── relationships.tsx
│   ├── cardinality-constraints.tsx
│   ├── participation-constraints.tsx
│   ├── weak-entity-set.tsx
│   ├── strong-entity-set.tsx
│   ├── er-diagram-basics.tsx
│   ├── specialization.tsx
│   ├── generalization.tsx
│   ├── aggregation.tsx
│   └── er-to-relational-mapping.tsx
│
├── relational-model/
│   ├── relational-model-introduction.tsx
│   ├── relation-schema.tsx
│   ├── keys-in-dbms.tsx
│   ├── super-key.tsx
│   ├── candidate-key.tsx
│   ├── primary-key.tsx
│   ├── foreign-key.tsx
│   ├── alternate-key.tsx
│   ├── composite-key.tsx
│   ├── relational-algebra.tsx
│   ├── select-operation.tsx
│   ├── project-operation.tsx
│   ├── join-operation.tsx
│   ├── union-intersection-set-difference.tsx
│   ├── cartesian-product.tsx
│   ├── relational-calculus.tsx
│   └── integrity-constraints.tsx
│
├── sql/
│   ├── introduction-to-sql.tsx
│   ├── sql-data-types.tsx
│   ├── create-database.tsx
│   ├── create-table.tsx
│   ├── alter-table.tsx
│   ├── drop-table.tsx
│   ├── insert-query.tsx
│   ├── update-query.tsx
│   ├── delete-query.tsx
│   ├── select-query.tsx
│   ├── where-clause.tsx
│   ├── order-by-clause.tsx
│   ├── group-by-clause.tsx
│   ├── having-clause.tsx
│   ├── joins-in-sql.tsx
│   ├── inner-join.tsx
│   ├── left-right-full-join.tsx
│   ├── nested-queries.tsx
│   ├── views-in-sql.tsx
│   ├── indexes-in-sql.tsx
│   ├── triggers.tsx
│   ├── stored-procedures.tsx
│   ├── functions-in-sql.tsx
│   ├── cursors.tsx
│   └── sql-practice-queries.tsx
│
├── normalization/
│   ├── normalization-introduction.tsx
│   ├── functional-dependency.tsx
│   ├── trivial-functional-dependency.tsx
│   ├── closure-of-attributes.tsx
│   ├── armstrong-axioms.tsx
│   ├── minimal-cover.tsx
│   ├── first-normal-form.tsx
│   ├── second-normal-form.tsx
│   ├── third-normal-form.tsx
│   ├── boyce-codd-normal-form.tsx
│   ├── fourth-normal-form.tsx
│   ├── fifth-normal-form.tsx
│   ├── multivalued-dependency.tsx
│   ├── join-dependency.tsx
│   ├── lossless-decomposition.tsx
│   ├── dependency-preserving-decomposition.tsx
│   └── denormalization.tsx
│
├── transactions-and-concurrency/
│   ├── transaction-introduction.tsx
│   ├── acid-properties.tsx
│   ├── transaction-states.tsx
│   ├── concurrent-execution.tsx
│   ├── serializability.tsx
│   ├── conflict-serializability.tsx
│   ├── view-serializability.tsx
│   ├── lock-based-protocols.tsx
│   ├── two-phase-locking.tsx
│   ├── timestamp-protocol.tsx
│   ├── deadlock-in-dbms.tsx
│   ├── deadlock-prevention-dbms.tsx
│   ├── deadlock-detection-dbms.tsx
│   ├── recovery-techniques.tsx
│   ├── log-based-recovery.tsx
│   ├── checkpoints.tsx
│   ├── shadow-paging.tsx
│   └── distributed-transactions.tsx
│
├── indexing-and-hashing/
│   ├── indexing-introduction.tsx
│   ├── ordered-indexing.tsx
│   ├── primary-index.tsx
│   ├── secondary-index.tsx
│   ├── clustered-index.tsx
│   ├── dense-vs-sparse-index.tsx
│   ├── multilevel-index.tsx
│   ├── b-tree.tsx
│   ├── b-plus-tree.tsx
│   ├── hashing-techniques.tsx
│   ├── static-hashing.tsx
│   ├── dynamic-hashing.tsx
│   ├── extendible-hashing.tsx
│   ├── linear-hashing.tsx
│   └── index-sequential-file.tsx
│
├── query-processing-and-optimization/
│   ├── query-processing.tsx
│   ├── parsing-and-translation.tsx
│   ├── query-evaluation.tsx
│   ├── query-optimization.tsx
│   ├── heuristic-optimization.tsx
│   ├── cost-based-optimization.tsx
│   ├── join-order-optimization.tsx
│   ├── execution-plans.tsx
│   ├── statistics-in-query-optimization.tsx
│   ├── pipelining.tsx
│   ├── materialization.tsx
│   └── query-performance-tuning.tsx
│
├── storage-and-file-organization/
│   ├── storage-system-overview.tsx
│   ├── file-organization.tsx
│   ├── heap-files.tsx
│   ├── sequential-files.tsx
│   ├── hashing-file-organization.tsx
│   ├── record-storage.tsx
│   ├── buffer-management.tsx
│   ├── page-replacement-algorithms-db.tsx
│   ├── disk-storage-structure.tsx
│   ├── raid-in-dbms.tsx
│   ├── storage-allocation.tsx
│   └── physical-data-storage.tsx
│
├── distributed-db-and-nosql/
│   ├── distributed-dbms.tsx
│   ├── distributed-database-architecture.tsx
│   ├── fragmentation-in-distributed-db.tsx
│   ├── replication.tsx
│   ├── cap-theorem.tsx
│   ├── nosql-introduction.tsx
│   ├── key-value-databases.tsx
│   ├── document-databases.tsx
│   ├── column-oriented-databases.tsx
│   ├── graph-databases.tsx
│   ├── mongodb-basics.tsx
│   ├── cassandra-basics.tsx
│   └── firebase-basics.tsx
│
├── database-security/
│   ├── database-security-introduction.tsx
│   ├── authentication-in-dbms.tsx
│   ├── authorization-in-dbms.tsx
│   ├── access-control.tsx
│   ├── sql-injection.tsx
│   ├── encryption-in-dbms.tsx
│   ├── backup-and-recovery.tsx
│   ├── auditing.tsx
│   ├── data-privacy.tsx
│   └── database-security-best-practices.tsx
│
├── advanced-topics/
│   ├── object-oriented-dbms.tsx
│   ├── object-relational-dbms.tsx
│   ├── temporal-databases.tsx
│   ├── multimedia-databases.tsx
│   ├── data-warehousing.tsx
│   ├── data-mining.tsx
│   ├── olap-vs-oltp.tsx
│   ├── big-data-introduction.tsx
│   ├── hadoop-basics.tsx
│   ├── spark-basics.tsx
│   ├── blockchain-databases.tsx
│   └── cloud-databases.tsx
│
└── database-engines/
    ├── mysql-architecture.tsx
    ├── postgresql-internals.tsx
    ├── sqlite-overview.tsx
    ├── oracle-db-architecture.tsx
    ├── sql-server-overview.tsx
    └── mariadb-vs-mysql.tsx