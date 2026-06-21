Documentation JPA et accès SQLite
=================================

Cette documentation donne des exemples et bonnes pratiques pour effectuer différents types d'appels SQL/JPA dans ce projet Spring Boot (SQLite).

1) Configuration (application.properties)

Exemple minimal à placer dans `src/main/resources/application.properties` :

```
spring.datasource.url=jdbc:sqlite:database.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.datasource.hikari.connection-init-sql=PRAGMA foreign_keys=ON;
```

2) Dépendances Maven utiles (pom.xml)

Ajoutez au `pom.xml` :

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
  <groupId>org.xerial</groupId>
  <artifactId>sqlite-jdbc</artifactId>
  <version>3.39.2.0</version>
</dependency>
```

3) Exemples fréquents dans les `Repository` (Spring Data)

- Méthodes dérivées (naming conventions)

```java
public interface CoutRepository extends JpaRepository<Cout, Long> {
    List<Cout> findByAmountGreaterThan(Double min);
    List<Cout> findTop5ByTypeOrderByDateDesc(String type);
    long countByType(String type);
}
```

- JPQL avec `@Query` (portable)

```java
@Query("SELECT c FROM Cout c WHERE c.amount > :min")
List<Cout> findExpensive(@Param("min") Double min);
```

- Requêtes natives SQL

```java
@Query(value = "SELECT * FROM cout WHERE amount > :min", nativeQuery = true)
List<Cout> findExpensiveNative(@Param("min") Double min);
```

- `@Modifying` pour `UPDATE` / `DELETE`

```java
@Transactional
@Modifying
@Query("UPDATE Cout c SET c.amount = :amt WHERE c.id = :id")
int updateAmount(@Param("id") Long id, @Param("amt") Double amt);
```

4) Pagination et tri

```java
Page<Cout> findByType(String type, Pageable pageable);

// utilisation : PageRequest.of(page, size, Sort.by("date").descending())
```

5) Projections / DTO

- Interface projection :

```java
public interface CoutSummary { Double getAmount(); String getType(); }
List<CoutSummary> findByType(String type);
```

- DTO via constructeur JPQL :

```java
@Query("SELECT new com.eval.glpi.dto.CoutDto(c.id, c.amount) FROM Cout c WHERE c.type = :t")
List<CoutDto> findDtos(@Param("t") String t);
```

6) Requêtes dynamiques — `Specification` / Criteria API

Étendre `JpaSpecificationExecutor<Cout>` et construire `Specification<Cout>` pour filtres dynamiques, combinaisons AND/OR et pagination.

7) Implémentation custom de repository

Créer une interface custom et une classe `...Impl` pour méthodes spécifiques utilisant `EntityManager` et `CriteriaBuilder`.

8) Alternatives hors JPA

- `JdbcTemplate` / `NamedParameterJdbcTemplate` : exécution SQL directe et mapping rapide.

```java
List<Cout> list = jdbcTemplate.query(
    "SELECT * FROM cout WHERE amount > ?",
    new Object[]{min},
    new BeanPropertyRowMapper<>(Cout.class)
);
```

- `SimpleJdbcInsert` pour insertions simples.

9) Transactions

- Utiliser `@Transactional` sur la couche service pour regrouper opérations.
- Garder les transactions courtes (SQLite verrouille la DB pour les écritures).

10) Particularités SQLite

- Activez `PRAGMA foreign_keys=ON;` pour respecter les FK.
- SQLite acquiert des verrous d'écriture; éviter les transactions longues.
- Tester les mappings de types (boolean, date, bigdecimal).

11) Commandes utiles

Pour lancer l'application :

```bash
mvn spring-boot:run
```

Pour exécuter les tests :

```bash
mvn test
```

12) Où mettre les exemples

- Exemples de repository se trouvent sous `src/main/java/com/eval/glpi/repository`.
- Fichier de configuration : `src/main/resources/application.properties`.

Besoin que j'ajoute aussi un exemple concret pour `CoutRepository` et/ou un petit guide d'utilisation (`docs/`)?

Requêtes avancées
-----------------

Voici des exemples courants et avancés que vous pouvez utiliser depuis un `Repository` Spring Data (JPQL ou `nativeQuery=true` lorsque nécessaire).

1) Conditions et opérateurs

```java
List<Cout> findByTypeIn(Collection<String> types);
List<Cout> findByAmountBetween(Double min, Double max);
List<Cout> findByDescriptionLike(String pattern); // pattern = "%mot%"
List<Cout> findByDateIsNull();
```

JPQL with named params:

```java
@Query("SELECT c FROM Cout c WHERE c.amount > :min AND (c.type = :t OR c.type = :t2)")
List<Cout> complexWhere(@Param("min") Double min, @Param("t") String t, @Param("t2") String t2);
```

2) ORDER BY

```java
@Query("SELECT c FROM Cout c WHERE c.type = :t ORDER BY c.date DESC, c.amount ASC")
List<Cout> byTypeOrdered(@Param("t") String type);
```

3) GROUP BY / HAVING et agrégats (SUM, AVG, COUNT, MIN, MAX)

```java
@Query("SELECT c.type, SUM(c.amount) FROM Cout c GROUP BY c.type")
List<Object[]> sumByType(); // each Object[] = {type, sum}

@Query("SELECT c.type, AVG(c.amount) FROM Cout c GROUP BY c.type HAVING AVG(c.amount) > :minAvg")
List<Object[]> avgByTypeHaving(@Param("minAvg") Double minAvg);
```

Vous pouvez aussi projeter dans un DTO via constructeur JPQL.

4) JOINs (JPQL)

Supposons que `TicketRef` ait une relation `@ManyToOne` vers `Cout` ou l'inverse.

```java
@Query("SELECT t FROM TicketRef t JOIN t.cout c WHERE c.amount > :min")
List<TicketRef> ticketsWithExpensiveCosts(@Param("min") Double min);

// fetch join pour éviter N+1
@Query("SELECT t FROM TicketRef t JOIN FETCH t.cout WHERE t.id = :id")
Optional<TicketRef> findWithCout(@Param("id") Long id);
```

Si vous avez besoin de `JOIN ON` (JPA 2.1+):

```java
@Query("SELECT a FROM A a JOIN B b ON b.someField = a.otherField WHERE b.flag = true")
List<A> joinOnExample();
```

Pour des jointures complexes ou des fonctions window, préférez `nativeQuery=true`.

5) CASE / Expressions conditionnelles

```java
@Query("SELECT c.id, CASE WHEN c.amount > 100 THEN 'HIGH' WHEN c.amount > 50 THEN 'MEDIUM' ELSE 'LOW' END FROM Cout c")
List<Object[]> amountLevel();
```

6) Sous-requêtes et EXISTS

```java
@Query("SELECT c FROM Cout c WHERE c.amount > (SELECT AVG(c2.amount) FROM Cout c2)")
List<Cout> aboveAverage();

@Query("SELECT t FROM TicketRef t WHERE EXISTS (SELECT 1 FROM Cout c WHERE c.id = t.cout.id AND c.amount > :min)")
List<TicketRef> ticketsWithCoutAbove(@Param("min") Double min);
```

7) Fenêtres (window functions) — SQL natif

JPQL ne supporte pas les fonctions window; utilisez une requête native si besoin:

```java
@Query(value = "SELECT id, amount, ROW_NUMBER() OVER (PARTITION BY type ORDER BY amount DESC) rn FROM cout", nativeQuery = true)
List<Object[]> withRowNumber();
```

8) Mises à jour en masse (bulk) — `@Modifying`

```java
@Transactional
@Modifying(clearAutomatically = true)
@Query("UPDATE Cout c SET c.active = false WHERE c.date < :d")
int deactivateOld(@Param("d") LocalDate cutoff);
```

9) Verrouillage (pessimistic/optimistic)

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT c FROM Cout c WHERE c.id = :id")
Optional<Cout> findForUpdate(@Param("id") Long id);
```

10) Paramètres positionnels vs nommés

```java
@Query("SELECT c FROM Cout c WHERE c.amount > ?1 AND c.type = ?2")
List<Cout> posParams(Double min, String type);
```

11) Conseils pratiques

- Préférez JPQL pour portabilité et `nativeQuery` pour fonctionnalités SQLite spécifiques.
- Testez les performances des agrégats et joins sur votre fichier `.db` réel.
- Pour opérations de lecture intensives, envisagez des indexes sur les colonnes utilisées en `WHERE` / `JOIN`.
- Avec `@Modifying` rappelez-vous qu'il s'agit d'opérations bulk qui contournent parfois le contexte de persistance; utilisez `clearAutomatically=true` si nécessaire.

Si vous voulez, j'ajoute des exemples concrets pour `CoutRepository` et des tests d'intégration pour chaque type de requête.
