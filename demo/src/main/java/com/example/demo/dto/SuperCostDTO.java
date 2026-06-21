// SuperCostDTO.java
package com.example.demo.dto;

public class SuperCostDTO {
    private Long ticketId;
    private Long itemId;
    private Double cost;
    private Integer type_cout;
    private String categorie;
    private Long createdAt;

    public SuperCostDTO() {
    }

    public SuperCostDTO(Long ticketId, Long itemId, Double cost, String categorie, Long createdAt, Integer type_cout) {
        this.ticketId = ticketId;
        this.itemId = itemId;
        this.cost = cost;
        this.categorie = categorie;
        this.createdAt = createdAt;
        this.type_cout = type_cout;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public Integer getType_cout() {
        return type_cout;
    }

    public void setType_cout(Integer type_cout) {
        this.type_cout = type_cout;
    }

}