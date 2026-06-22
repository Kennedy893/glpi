package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.dto.CategorieStatsDTO;
import com.example.demo.dto.SuperCostSummaryDTO;
import com.example.demo.entity.SuperCost;

@Repository
public interface SuperCostRepository extends JpaRepository<SuperCost, Long> {
    
    // ===== REQUÊTES EXISTANTES =====
    List<SuperCost> findByTicketId(Long ticketId);
    List<SuperCost> findByItemId(Long itemId);
    SuperCost findByTicketIdAndItemId(Long ticketId, Long itemId);
    Optional<SuperCost> findById(Long id);

    // STATS DES COUTS
    @Query("SELECT new com.example.demo.dto.CategorieStatsDTO(" +
       "s.categorie, " +
       "SUM(CASE WHEN s.type_cout = 1 THEN s.cout ELSE 0 END), " +
       "SUM(CASE WHEN s.type_cout = 2 THEN s.cout ELSE 0 END), " +
       "SUM(CASE WHEN s.type_cout = 3 THEN s.cout ELSE 0 END)) " +
       "FROM SuperCost s WHERE s.etat = 1 " +
       "GROUP BY s.categorie")
    List<CategorieStatsDTO> getCoutStatsByCategorie();

    // GET DERNIERS COUTS D'UN TICKET
    // @Query("SELECT s FROM SuperCost s WHERE s.ticketId = :ticketId AND s.type_cout IN (1, 2) AND s.createdAt IN (" +
    //    "(SELECT MAX(s2.createdAt) FROM SuperCost s2 WHERE s2.ticketId = :ticketId AND s2.type_cout = 1), " +
    //    "(SELECT MAX(s3.createdAt) FROM SuperCost s3 WHERE s3.ticketId = :ticketId AND s3.type_cout = 2))")
    @Query("SELECT s FROM SuperCost s WHERE s.type_cout = 1 AND s.ticketId = :ticketId AND s.etat = 1 AND s.createdAt = " + 
        "(SELECT MAX(s2.createdAt) FROM SuperCost s2 WHERE s2.ticketId = :ticketId AND s.etat = 1 AND s2.type_cout = 1)")
    List<SuperCost> getLastSuperCost(@Param("ticketId") Long ticketId);

    @Query("SELECT s FROM SuperCost s WHERE s.type_cout = 2 AND s.ticketId = :ticketId AND s.etat = 1 AND s.createdAt = " + 
        "(SELECT MAX(s2.createdAt) FROM SuperCost s2 WHERE s2.ticketId = :ticketId AND s.etat = 1 AND s2.type_cout = 1)")
    List<SuperCost> getLastGlpiCost(@Param("ticketId") Long ticketId);

    // ALTERNATIVE
    // @Modifying        
    // @Transactional
    // @Query("UPDATE SuperCost s SET s.cout = 0 WHERE s.type_cout = 1 AND s.createdAt = (SELECT MAX(s2.createdAt) FROM SuperCost s2)")
    // List<SuperCost> updateLastSuperCostToZero();

    // Verifier si le cout glpi existe deja
    @Query("SELECT s from SuperCost s WHERE s.ticketId = :ticketId AND s.itemId = :itemId " +
        " AND s.type_cout = 2 AND s.categorie = :categorie"
    )
    List<SuperCost> getSuperCost(@Param("ticketId") Long ticketId, @Param("itemId") Long itemId, @Param("categorie") String categorie);

    // Recuperer les couts par categorie
    List<SuperCost> findByCategorie(String categorie);

    // Get premier cout
    @Query("SELECT s FROM SuperCost s WHERE s.type_cout = 1 AND s.ticketId = :ticketId AND s.etat = 1 AND s.createdAt = " + 
        "(SELECT MIN(s2.createdAt) FROM SuperCost s2 WHERE s2.ticketId = :ticketId AND s.etat = 1 AND s2.type_cout = 1)")
    List<SuperCost> getFirstSuperCost(@Param("ticketId") Long ticketId);

    // Somme de tous les SUPER COST d'un ticket
    @Query("SELECT s.id, s.ticketId, s.itemId, SUM(s.cout), s.categorie, s.createdAt, s.type_cout FROM SuperCost s WHERE s.ticketId = :ticketId AND s.etat = 1 GROUP BY s.type_cout")
    // @Query("SELECT s.id, s.ticketId, s.itemId, SUM(s.cout), s.categorie, s.createdAt, s.type_cout FROM SuperCost s WHERE s.ticketId = :ticketId AND s.type_cout = 1 GROUP BY s.itemId, s.categorie")
    List<Object[]> getSumSuperCost(@Param("ticketId") Long ticketId);

    // @Query("SELECT \r\n" + //
    //             "    id, \r\n" + //
    //             "    ticketId, \r\n" + //
    //             "    itemId, \r\n" + //
    //             "    SUM(cout),\r\n" + //
    //             "    categorie, \r\n" + //
    //             "    createdAt, \r\n" + //
    //             "    type_cout \r\n" + //
    //             "FROM SuperCost s\r\n" + //
    //             "WHERE ticketId = :ticketId \r\n" + //
    //             "    AND type_cout = 1\r\n" + //
    //             "    AND id = (\r\n" + //
    //             "        SELECT MIN(id)\r\n" + //
    //             "        FROM SuperCost s2\r\n" + //
    //             "        WHERE s2.ticketId = s.ticketId \r\n" + //
    //             "            AND s2.createdAt = s.createdAt\r\n" + //
    //             "            AND s2.type_cout = 1\r\n" + //
    //             "    )")
    // List<Object[]> getSumSuperCost(@Param("ticketId") Long ticketId);

    // @Query("SELECT new com.example.demo.dto.SuperCostSummaryDTO(" +
    //     "s.id, " +
    //     "s.ticketId, " +
    //     "s.itemId, " +
    //     "SUM(s.cout), " +
    //     "s.categorie, " +
    //     "s.createdAt, " +
    //     "s.type_cout) " +
    //     "FROM SuperCost s " +
    //     "WHERE s.ticketId = :ticketId " +
    //     "   AND s.type_cout = 1 " +
    //     "   AND s.id = (SELECT MIN(s2.id) " +
    //     "               FROM SuperCost s2 " +
    //     "               WHERE s2.ticketId = s.ticketId " +
    //     "                 AND s2.createdAt = s.createdAt " +
    //     "                 AND s2.type_cout = 1) " +
    //     "GROUP BY s.id, s.ticketId, s.itemId, s.categorie, s.createdAt, s.type_cout")
    // List<SuperCostSummaryDTO> getSumSuperCost(@Param("ticketId") Long ticketId);

    // Moyenne de tous les SUPER COST d'un ticket
    @Query("SELECT s.id, s.ticketId, s.itemId, AVG(s.cout), s.categorie, s.createdAt, s.type_cout FROM SuperCost s WHERE s.ticketId = :ticketId AND s.etat = 1 GROUP BY s.type_cout")
    List<Object[]> getAverageSuperCost(@Param("ticketId") Long ticketId);

    // All supercosts pour un ticket
    // List<SuperCost> getSomme ()

    // Liste de tous les supercosts
    @Query("SELECT s from SuperCost s WHERE s.type_cout = 1")
    List<SuperCost> getAllSuperCost();

    // Liste de tous les couts de reouvertures
    @Query("SELECT s from SuperCost s WHERE s.type_cout = 3")
    List<SuperCost> getAllReouvertureCost();

    // Update un superCost
    @Modifying
    @Query("UPDATE SuperCost SET cout = :cout where id = :id")
    void updateSuper(@Param("cout") Double cout, @Param("id") Long id);

    @Modifying
    @Query("UPDATE SuperCost SET cout = :cout, mode = :mode where id = :id")
    void updateReouv(@Param("cout") Double cout, @Param("id") Long id, @Param("mode") Integer mode);

}