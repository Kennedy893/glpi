package com.example.demo.dto;

public class SuperCostSummaryDTO {
    private Long id;
    private Long ticketId;
    private Long itemId;
    private Double totalCout;
    private String categorie;
    private Long createdAt;
    private Integer typeCout;

    public SuperCostSummaryDTO(Long id, Long ticketId, Long itemId, Double totalCout, 
                               String categorie, Long createdAt, Integer typeCout) {
        this.id = id;
        this.ticketId = ticketId;
        this.itemId = itemId;
        this.totalCout = totalCout;
        this.categorie = categorie;
        this.createdAt = createdAt;
        this.typeCout = typeCout;
    }

    // Getters
    public Long getId() { return id; }
    public Long getTicketId() { return ticketId; }
    public Long getItemId() { return itemId; }
    public Double getTotalCout() { return totalCout; }
    public String getCategorie() { return categorie; }
    public Long getCreatedAt() { return createdAt; }
    public Integer getTypeCout() { return typeCout; }
}
