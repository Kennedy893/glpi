CREATE TABLE kanban_column (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status_id INTEGER NOT NULL UNIQUE,
    status_label TEXT NOT NULL,
    color TEXT NOT NULL,
    label_mg TEXT NOT NULL
);


CREATE TABLE super_cost(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL UNIQUE,
    item_id INTEGER NOT NULL UNIQUE,
    cout DECOIMAL(10, 2) NOT NULL
);

SELECT id, ticket_id, item_id, AVG(cout), categorie, created_at, type_cout FROM super_cost s WHERE ticket_id = 273 GROUP BY type_cout;

SELECT id, ticket_id, item_id, SUM(cout)*7.5/100, categorie, created_at, type_cout FROM super_cost s WHERE ticket_id = 275 GROUP BY type_cout;

SELECT SUM(cout) AS total_super_cost
FROM super_cost 
WHERE ticket_id = 275
    AND type_cout = 1;

SELECT 
    id, 
    ticket_id, 
    item_id, 
    cout,
    categorie, 
    created_at, 
    type_cout 
FROM super_cost 
WHERE ticket_id = 275 
    AND created_at = (
        SELECT MAX(created_at) 
        FROM super_cost 
        WHERE ticket_id = 275
    )
    AND type_cout = 1;


-- ============================================================
-- Requête : Récupérer une seule ligne par created_at
-- But     : Éviter les doublons quand plusieurs enregistrements
--           ont le même created_at pour un même ticket
-- ============================================================
SELECT 
    id, 
    ticket_id, 
    item_id, 
    SUM(cout),
    categorie, 
    created_at, 
    type_cout 
FROM super_cost s
WHERE ticket_id = 275 
    AND type_cout = 1
    -- Sous-requête : Ne garder qu'une ligne par created_at
    AND id = (
        SELECT MIN(id)
        FROM super_cost s2
        WHERE s2.ticket_id = s.ticket_id 
            AND s2.created_at = s.created_at
            AND s2.type_cout = 1
    );
-- Pas de GROUP BY car on prend une ligne spécifique avec MIN(id)
-- Pas de ORDER BY car on veut toutes les lignes (une par created_at)


SELECT 
    id, 
    ticket_id, 
    item_id, 
    AVG(cout),
    categorie, 
    created_at, 
    type_cout 
FROM super_cost s
WHERE ticket_id = 285
    AND type_cout = 1
    -- Sous-requête : Ne garder qu'une ligne par created_at
    AND id = (
        SELECT MIN(id)
        FROM super_cost s2
        WHERE s2.ticket_id = s.ticket_id 
            AND s2.created_at = s.created_at
            AND s2.type_cout = 1
    );

SELECT s.id, s.ticket_id, s.item_id, AVG(s.cout), s.categorie, s.created_at, s.type_cout FROM super_cost s WHERE s.ticket_id = 285 GROUP BY s.type_cout;



SELECT id ,ticket_id,type_cout,SUM(cout) as cout ,item_id,categorie
    FROM super_cost 
    WHERE ticket_id = 297
    AND type_cout = 1 GROUP BY item_id, categorie;


-- Récupérer le SuperCost le plus élevé d'un ticket
SELECT MAX(cout) FROM super_cost WHERE ticket_id = 303;

-- Récupérer les SuperCosts supérieurs à la moyenne d'un ticket
SELECT * FROM super_cost WHERE ticket_id = 303 AND 
    cout > (SELECT AVG(cout) FROM super_cost WHERE ticket_id = 303);

-- Catégoriser les coûts (Faible < 50, Moyen 50-200, Élevé > 200)
SELECT id, item_id, cout, categorie,
 (CASE WHEN cout < 50 THEN 'faible'
 WHEN cout >= 50 AND cout < 200 THEN 'moyen'
 WHEN cout >= 200 THEN 'eleve' ELSE 'N/D' END) AS type
 FROM super_cost;


-- Raha misy ANNULATION dia afaka mamorona colonne "etat" (par defaut = 1)
-- dia raha misy annulation dia mivadika 0 
-- dia am maka supercost asiana where etat = 1