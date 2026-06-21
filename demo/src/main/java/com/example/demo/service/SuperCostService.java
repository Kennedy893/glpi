// SuperCostService.java
package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.CategorieStatsDTO;
import com.example.demo.entity.SuperCost;
import com.example.demo.repository.SuperCostRepository;


@Service
@Transactional
public class SuperCostService {

    @Autowired
    private SuperCostRepository repository;

    public SuperCost createSuperCost(SuperCost supercost) {
        return repository.save(supercost);
    }

    public List<SuperCost> getAll() {
        return repository.findAll();
    }

    public List<SuperCost> getByTicketId(Long ticketId) {
        return repository.findByTicketId(ticketId);
    }

    public List<SuperCost> getByItemId(Long itemId) {
        return repository.findByItemId(itemId);
    }

    public long deleteAll() {
        long count = repository.count();
        repository.deleteAll();
        return count;
    }

    // ✅ Mettre à jour le coût par ticketId ET itemId
    public SuperCost updateCostByTicketAndItem(Long ticketId, Long itemId, Double newCost) {
        // Chercher l'enregistrement existant
        SuperCost existing = repository.findByTicketIdAndItemId(ticketId, itemId);
        
        if (existing == null) {
            throw new RuntimeException("Aucun super cost trouvé pour ticketId=" + ticketId + " et itemId=" + itemId);
        }
        
        // Mettre à jour le coût
        // existing.setReouverture(newCost);
        
        // Optionnel: mettre à jour la date
        // existing.setUpdatedAt(LocalDateTime.now().toString());
        
        return repository.save(existing);
    }

    // STATS DES COUTS
    public List<CategorieStatsDTO> getCoutStatsByCategorie() {
        return repository.getCoutStatsByCategorie();
    }

    // DERNIER COUT D'UN TICKET
    public List<SuperCost> getLastSuperCost(@Param("ticketId") Long ticketId) {
        return repository.getLastSuperCost(ticketId);
    }

    // ANNNULER DERNIER COUT (super ET glpi)
    @Transactional
    public int annulerDernierSuperCost(Long ticketId) {
        int updatedCount = 0;
        
        List<SuperCost> lastCosts = repository.getLastSuperCost(ticketId);
        for (SuperCost cost : lastCosts) {
            cost.setCout(0.0);
            repository.save(cost);  // Sauvegarder en base
            updatedCount++;
        }

        // List<SuperCost> lastCostsGlpi = repository.getLastGlpiCost(ticketId);
        // for (SuperCost cost : lastCostsGlpi) {
        //     cost.setCout(0.0);
        //     repository.save(cost);  // Sauvegarder en base
        //     updatedCount++;
        // }
        
        return updatedCount;
    }

    public SuperCost getSuperCost(Long ticketId, Long itemId, String categorie) {
        List<SuperCost> superCosts = repository.getSuperCost(ticketId, itemId, categorie);
        return superCosts.isEmpty() ? null : superCosts.get(0);
    }

    // Recup par categorie
    public List<SuperCost> findByCategorie(String categorie) {
        return repository.findByCategorie(categorie);
    }

    // PREMIER COUT D'UN TICKET
    public List<SuperCost> getFirstSuperCost(Long ticketId) {
        return repository.getFirstSuperCost(ticketId);
    }

    // SOMME DES COUTS
    public List<Object[]> getSumSuperCost(Long ticketId) {
        return repository.getSumSuperCost(ticketId);
    }

    // MOENNEE DES COUTS
    public List<Object[]> getAvgSuperCost(Long ticketId) {
        return repository.getAverageSuperCost(ticketId);
    }

}