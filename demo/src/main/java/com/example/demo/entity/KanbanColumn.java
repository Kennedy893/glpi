package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entité représentant les paramètres d'une colonne Kanban.
 * Stockée dans la table "kanban_column" de SQLite.
 */
@Entity
@Table(name = "kanban_column")
public class KanbanColumn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ID du statut GLPI : 1=Nouveau, 2=En cours, 6=Terminé */
    @Column(name = "status_id", nullable = false, unique = true)
    private Integer statusId;

    /** Label français par défaut : "Nouveau", "En cours", "Résolu" */
    @Column(name = "status_label", nullable = false)
    private String statusLabel;

    /** Couleur de fond en hexadécimal : ex "#3b82f6" */
    @Column(name = "color", nullable = false)
    private String color;

    /** Nom en malgache : ex "Vaovao", "Efa manao", "Vita" */
    @Column(name = "label_mg", nullable = false)
    private String labelMg;

    // ─── Constructeurs ────────────────────────────────────
    public KanbanColumn() {}

    public KanbanColumn(Integer statusId, String statusLabel, String color, String labelMg) {
        this.statusId    = statusId;
        this.statusLabel = statusLabel;
        this.color       = color;
        this.labelMg     = labelMg;
    }

    // ─── Getters / Setters ────────────────────────────────
    public Long getId()                       { return id; }
    public void setId(Long id)                { this.id = id; }

    public Integer getStatusId()              { return statusId; }
    public void setStatusId(Integer statusId) { this.statusId = statusId; }

    public String getStatusLabel()                  { return statusLabel; }
    public void setStatusLabel(String statusLabel)  { this.statusLabel = statusLabel; }

    public String getColor()              { return color; }
    public void setColor(String color)    { this.color = color; }

    public String getLabelMg()              { return labelMg; }
    public void setLabelMg(String labelMg) { this.labelMg = labelMg; }
}