// SuperCostController.java
package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.CategorieStatsDTO;
import com.example.demo.dto.SuperCostDTO;
import com.example.demo.entity.SuperCost;
import com.example.demo.service.SuperCostService;

@RestController
@RequestMapping("/api/super-cost")
@CrossOrigin(origins = "*")
public class SuperCostController {

    private final SuperCostService service;

    public SuperCostController(SuperCostService service) {
        this.service = service;
    }

    @PostMapping("/create/super")
    public ResponseEntity<SuperCost> createSuperCost(@RequestBody SuperCostDTO superCostDTO) {
        SuperCost superCost = new SuperCost();
        superCost.setTicketId(superCostDTO.getTicketId());
        superCost.setItemId(superCostDTO.getItemId());
        superCost.setType_cout(1);  // type_cout = superCost
        superCost.setCout(superCostDTO.getCost());
        superCost.setCategorie(superCostDTO.getCategorie());
        superCost.setMode(superCostDTO.getMode());
        superCost.setCreatedAtNow();
        
        SuperCost saved = service.createSuperCost(superCost);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/create/glpi")
    public ResponseEntity<SuperCost> createGlpiCost(@RequestBody SuperCostDTO superCostDTO) {
        SuperCost oldSuperCost = service.getSuperCost(superCostDTO.getTicketId(), superCostDTO.getItemId(), superCostDTO.getCategorie());
        if (oldSuperCost != null) {
            return ResponseEntity.ok(null);
        }

        SuperCost superCost = new SuperCost();
        superCost.setTicketId(superCostDTO.getTicketId());
        superCost.setItemId(superCostDTO.getItemId());
        superCost.setType_cout(2);  // type_cout = glpiCost
        superCost.setCout(superCostDTO.getCost());
        superCost.setCategorie(superCostDTO.getCategorie());
        superCost.setCreatedAtNow();
        
        SuperCost saved = service.createSuperCost(superCost);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/create/reouverture")
    public ResponseEntity<SuperCost> createReouvertureCost(@RequestBody SuperCostDTO superCostDTO) {
        SuperCost superCost = new SuperCost();
        superCost.setTicketId(superCostDTO.getTicketId());
        superCost.setItemId(superCostDTO.getItemId());
        superCost.setType_cout(3);  // type_cout = reouvertureCost
        superCost.setCout(superCostDTO.getCost());
        superCost.setCategorie(superCostDTO.getCategorie());
        superCost.setMode(superCostDTO.getMode());
        superCost.setCreatedAtNow();
        
        SuperCost saved = service.createSuperCost(superCost);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SuperCost>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<SuperCost>> getByTicketId(@PathVariable Long ticketId) {
        return ResponseEntity.ok(service.getByTicketId(ticketId));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<SuperCost>> getByItemId(@PathVariable Long itemId) {
        return ResponseEntity.ok(service.getByItemId(itemId));
    }

    @DeleteMapping("/all")
    public ResponseEntity<Map<String, String>> deleteAll() {
        try {
            long deletedCount = service.deleteAll();
            Map<String, String> response = new HashMap<>();
            response.put("message", deletedCount + " super cost(s) supprimé(s) avec succès");
            response.put("status", "success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Erreur lors de la suppression: " + e.getMessage());
            response.put("status", "error");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Mettre à jour le coût par ticketId ET itemId
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateCost(
            @RequestParam Long ticketId,
            @RequestParam Long itemId,
            @RequestParam Double cost) {
        
        try {
            SuperCost updated = service.updateCostByTicketAndItem(ticketId, itemId, cost);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Coût mis à jour avec succès");
            response.put("data", updated);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/statsByCategorie")
    public ResponseEntity<List<CategorieStatsDTO>> getCoutStatsByCategorie() {
        return ResponseEntity.ok(service.getCoutStatsByCategorie());
    }
    
    @GetMapping("/last/{ticketId}")
    public ResponseEntity<List<SuperCost>> getLastSuperCost(@PathVariable Long ticketId) {
        return ResponseEntity.ok(service.getLastSuperCost(ticketId));
    }

    // Dernier supercost par un ticket
    @PostMapping("/annuler/last/{ticketId}")
    public ResponseEntity<?> annulerDernierSuperCost(@PathVariable Long ticketId) {
        int count = service.annulerDernierSuperCost(ticketId);
        return ResponseEntity.ok(Map.of(
            "message", "Derniers coûts annulés avec succès",
            "nombre_modifies", count
        ));
    }

    // Recup par categorie
    @GetMapping("/{categorie}")
    public ResponseEntity<List<SuperCost>> findByCategorie(@PathVariable String categorie) {
        return ResponseEntity.ok(service.findByCategorie(categorie));
    }

    // Premier supercost par un ticket
    @GetMapping("/first/{ticketId}")
    public ResponseEntity<List<SuperCost>> getFirstSuperCost(@PathVariable Long ticketId) {
        return ResponseEntity.ok(service.getFirstSuperCost(ticketId));
    }

    // Somme des supercosts
    @GetMapping("/sum/{ticketId}")
    public ResponseEntity<List<Object[]>> getSumSuperCost(@PathVariable("ticketId") Long ticketId) {
        return ResponseEntity.ok(service.getSumSuperCost(ticketId));
    }

    // Moyenne des supercosts
    @GetMapping("/avg/{ticketId}")
    public ResponseEntity<List<Object[]>> getAvgSuperCost(@PathVariable("ticketId") Long ticketId) {
        return ResponseEntity.ok(service.getAvgSuperCost(ticketId));
    }

    // Somme 
    // public ResponseEntity<SuperCost> getSomme() {
    //     List<SuperCost> superCosts = service.getAll();
    //     for (SuperCost superCost of superCosts) {

    //     }
    // }


    // TOUS LES SUPERCOSTS
    @GetMapping("/allSuperCost")
    public ResponseEntity<List<SuperCost>> getAllSuperCost() {
        return ResponseEntity.ok(service.getAllSuperCost());
    }

    // TOUS LES COUTS DE REOUVERTURE
    @GetMapping("/allReouverture")
    public ResponseEntity<List<SuperCost>> getAllReouvertureCost() {
        return ResponseEntity.ok(service.getAllReouvertureCost());
    }

    // @PutMapping("/updateSup/{id}")
    // public ResponseEntity<SuperCost> updateSuper(@PathVariable("id") Long id, Double cout) {
    //     return ResponseEntity.ok(service.updateSuper(cout, id));
    // }

    @PutMapping("/updateSup/{id}")
    public ResponseEntity<SuperCost> updateSuper(@PathVariable("id") Long id, @RequestParam Double cout) {
        Optional<SuperCost> sup = Optional.of(service.findById(id).orElse(null));
        sup.orElseThrow().setCout(cout);
        service.updateSuper(cout, id);
        return ResponseEntity.ok(sup.orElse(null));
    }

    @PutMapping("/updateReouv/{id}")
    public ResponseEntity<SuperCost> updateReouv(@PathVariable("id") Long id, @RequestParam Double cout, @RequestParam Integer mode) {
        Optional<SuperCost> sup = Optional.of(service.findById(id).orElse(null));
        sup.orElseThrow().setCout(cout);
        sup.orElseThrow().setMode(mode);
        service.updateReouv(cout, id, mode);
        return ResponseEntity.ok(sup.orElse(null));
    }
}