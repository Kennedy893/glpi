package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.KanbanSettingsDTO;
import com.example.demo.service.KanbanSettingsService;
import java.util.List;
import com.example.demo.entity.KanbanColumn;
import com.example.demo.repository.KanbanColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;


/**
 * Contrôleur REST exposant les endpoints pour les paramètres Kanban.
 *
 * GET  /api/kanban-settings   → lire les paramètres actuels
 * PUT  /api/kanban-settings   → mettre à jour les paramètres
 */
@RestController
@RequestMapping("/api/kanban-settings")
public class KanbanSettingsController {

    private final KanbanSettingsService service;

    public KanbanSettingsController(KanbanSettingsService service) {
        this.service = service;
    }

    /**
     * GET /api/kanban-settings
     * Retourne les paramètres actuels des 3 colonnes.
     *
     * Réponse :
     * {
     *   "columns": [
     *     { "statusId": 1, "statusLabel": "Nouveau",  "color": "#3b82f6", "labelMg": "Vaovao"    },
     *     { "statusId": 2, "statusLabel": "En cours", "color": "#f59e0b", "labelMg": "Efa manao" },
     *     { "statusId": 5, "statusLabel": "Résolu",   "color": "#10b981", "labelMg": "Vita"      }
     *   ]
     * }
     */
    @GetMapping
    public ResponseEntity<KanbanSettingsDTO> getSettings() {
        KanbanSettingsDTO settings = service.getSettings();
        return ResponseEntity.ok(settings);
    }

    /**
     * PUT /api/kanban-settings
     * Met à jour les paramètres (color + labelMg) pour chaque colonne.
     *
     * Body attendu : même format que la réponse GET
     */
    @PutMapping
    public ResponseEntity<KanbanSettingsDTO> updateSettings(@RequestBody KanbanSettingsDTO dto) {
        if (dto.getColumns() == null || dto.getColumns().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        KanbanSettingsDTO updated = service.updateSettings(dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/reset")
    public ResponseEntity<String> resetSettings() {
        service.resetToDefaults();
        return ResponseEntity.ok("Paramètres réinitialisés aux valeurs par défaut.");
    }
}