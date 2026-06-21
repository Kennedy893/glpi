package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.dto.KanbanSettingsDTO;
import com.example.demo.entity.KanbanColumn;
import com.example.demo.repository.KanbanColumnRepository;

/**
 * Service gérant la logique métier des paramètres Kanban.
 * - Lecture depuis SQLite
 * - Initialisation des valeurs par défaut si la table est vide
 * - Mise à jour des paramètres
 */
@Service
public class KanbanSettingsService {

    private final KanbanColumnRepository repository;

    // Valeurs par défaut — utilisées si la table est vide
    private static final List<KanbanColumn> DEFAULT_COLUMNS = List.of(
        new KanbanColumn(1, "New",  "#3b82f6", "Vaovao"),
        new KanbanColumn(2, "In progress", "#f59e0b", "Efa manao"),
        new KanbanColumn(6, "Closed",   "#10b981", "Vita")
    );

    public KanbanSettingsService(KanbanColumnRepository repository) {
        this.repository = repository;
        // initDefaultsIfEmpty();
    }

    /**
     * Insère les valeurs par défaut si la table est vide.
     * Appelé une seule fois au démarrage.
     */
    private void initDefaultsIfEmpty() {
        if (repository.count() == 0) {
            repository.saveAll(DEFAULT_COLUMNS);
            System.out.println("[KanbanSettings] ✅ Valeurs par défaut insérées.");
        }
    }

    /**
     * Retourner tous les paramètres sous forme de DTO.
     */
    public KanbanSettingsDTO getSettings() {
        List<KanbanColumn> columns = repository.findAll();

        List<KanbanSettingsDTO.ColumnDTO> dtos = columns.stream()
            .map(c -> new KanbanSettingsDTO.ColumnDTO(
                c.getStatusId(),
                c.getStatusLabel(),
                c.getColor(),
                c.getLabelMg()
            ))
            .collect(Collectors.toList());

        return new KanbanSettingsDTO(dtos);
    }

    /**
     * Mettre à jour les paramètres depuis le DTO envoyé par React.
     * Pour chaque colonne du DTO, on cherche l'entité existante par statusId
     * et on met à jour color + labelMg.
     */
    public KanbanSettingsDTO updateSettings(KanbanSettingsDTO dto) {
        for (KanbanSettingsDTO.ColumnDTO colDto : dto.getColumns()) {
            Optional<KanbanColumn> existing = repository.findByStatusId(colDto.getStatusId());

            if (existing.isPresent()) {
                // Mettre à jour les champs modifiables
                KanbanColumn col = existing.get();
                col.setColor(colDto.getColor());
                col.setLabelMg(colDto.getLabelMg());
                repository.save(col);
            } else {
                // Créer si absent (ne devrait pas arriver après initDefaults)
                repository.save(new KanbanColumn(
                    colDto.getStatusId(),
                    colDto.getStatusLabel(),
                    colDto.getColor(),
                    colDto.getLabelMg()
                ));
            }
        }

        return getSettings(); // retourner l'état final
    }

    public void resetToDefaults() {
        repository.deleteAll();
        repository.saveAll(DEFAULT_COLUMNS);
    }
}