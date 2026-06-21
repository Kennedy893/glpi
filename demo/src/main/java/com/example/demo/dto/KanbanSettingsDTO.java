package com.example.demo.dto;

import java.util.List;

/**
 * DTO pour l'échange JSON avec React.
 *
 * Format attendu / retourné :
 * {
 *   "columns": [
 *     { "statusId": 1, "statusLabel": "Nouveau",  "color": "#3b82f6", "labelMg": "Vaovao"    },
 *     { "statusId": 2, "statusLabel": "En cours", "color": "#f59e0b", "labelMg": "Efa manao" },
 *     { "statusId": 5, "statusLabel": "Résolu",   "color": "#10b981", "labelMg": "Vita"      }
 *   ]
 * }
 */
public class KanbanSettingsDTO {

    private List<ColumnDTO> columns;

    public KanbanSettingsDTO() {}
    public KanbanSettingsDTO(List<ColumnDTO> columns) { this.columns = columns; }

    public List<ColumnDTO> getColumns()                   { return columns; }
    public void setColumns(List<ColumnDTO> columns)       { this.columns = columns; }

    // ─── DTO imbriqué pour une colonne ───────────────────
    public static class ColumnDTO {
        private Integer statusId;
        private String  statusLabel;
        private String  color;
        private String  labelMg;

        public ColumnDTO() {}

        public ColumnDTO(Integer statusId, String statusLabel, String color, String labelMg) {
            this.statusId    = statusId;
            this.statusLabel = statusLabel;
            this.color       = color;
            this.labelMg     = labelMg;
        }

        public Integer getStatusId()                    { return statusId; }
        public void setStatusId(Integer statusId)       { this.statusId = statusId; }

        public String getStatusLabel()                  { return statusLabel; }
        public void setStatusLabel(String statusLabel)  { this.statusLabel = statusLabel; }

        public String getColor()                        { return color; }
        public void setColor(String color)              { this.color = color; }

        public String getLabelMg()                      { return labelMg; }
        public void setLabelMg(String labelMg)          { this.labelMg = labelMg; }
    }
}