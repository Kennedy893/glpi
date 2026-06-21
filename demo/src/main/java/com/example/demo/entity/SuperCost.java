// SuperCost.java - Entité corrigée avec ticketId, itemId et cout
package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "super_cost")
public class SuperCost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_id", nullable = true)  // ← Changé à true
    private Long ticketId;

    @Column(name = "item_id", nullable = true)     // ← Changé à true
    private Long itemId;

    @Column(name = "cout", nullable = true)
    private Double cout;

    @Column(name = "categorie", nullable = true)
    private String categorie;

    @Column(name = "created_at")
    private Long createdAt;

    @Column(name = "type_cout") // 1=superCost, 2=coutglpi, 3=reouverture
    private Integer type_cout;


    // Constructeur par défaut (obligatoire pour JPA)
    public SuperCost() {
    }

    // Constructeur avec paramètres
    public SuperCost(Long ticketId, Long itemId, Double cout, String categorie, Long createdAt, Integer type_cout) {
        this.ticketId = ticketId;
        this.itemId = itemId;
        this.cout = cout;
        this.categorie = categorie;
        this.createdAt = createdAt;
        this.type_cout = type_cout;
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Double getCout() {
        return cout;
    }

    public void setCout(Double cout) {
        this.cout = cout;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public void setCreatedAtNow() {
        this.createdAt = System.currentTimeMillis() / 1000; // Unix timestamp en secondes
    }

    public Integer getType_cout() {
        return type_cout;
    }

    public void setType_cout(Integer type_cout) {
        this.type_cout = type_cout;
    }
}