package com.example.demo.dto;

public class CategorieStatsDTO {
    private String categorie;
    private Double totalSuper;
    private Double totalGlpi;
    private Double totalReouverture;
    private Double totalGeneral; 
    
    public CategorieStatsDTO(String categorie, Double totalSuper, Double totalGlpi, Double totalReouverture) {
        this.categorie = categorie;
        this.totalSuper = totalSuper != null ? totalSuper : 0.0;
        this.totalGlpi = totalGlpi != null ? totalGlpi : 0.0;
        this.totalReouverture = totalReouverture != null ? totalReouverture : 0.0;
        this.totalGeneral = this.totalSuper + this.totalGlpi + this.totalReouverture;
    }
    
    // Getters
    public String getCategorie() { return categorie; }
    public Double getTotalSuper() { return totalSuper; }
    public Double getTotalGlpi() { return totalGlpi; }
    public Double getTotalReouverture() { return totalReouverture; }
    public Double getTotalGeneral() { return totalGeneral; }
}
