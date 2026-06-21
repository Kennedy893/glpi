package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.KanbanColumn;

import java.util.Optional;

/**
 * Repository JPA pour accéder aux paramètres des colonnes Kanban dans SQLite.
 */
@Repository
public interface KanbanColumnRepository extends JpaRepository<KanbanColumn, Long> {

    /** Trouver une colonne par son statusId GLPI */
    Optional<KanbanColumn> findByStatusId(Integer statusId);
}