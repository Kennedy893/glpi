* mamindra anle kanban => misy cout vaovao (=super cost) ampidirina (stockena anaty sqlite) : -> terminé
COUT FIXE VAOVAO

* page vaovao misy resaka cout = misy liste items (misy ny cout efa anaty import sy ny cout vaovao (colonne iray))
NB: cout total telephone...
rah ticket iray misy pc 2 => cout/2

cout tany am import | cout 

PC | cout glpi | super cost | total


la suite du sujet c'est :
- ajouter un champ "superCost" quand on glisse vers "terminé" et ce superCost doit etre inseré dans sqlite (l'app spring-boot qui expose l'endpoint de creation)
- ensuite on cree une nouvelle page de liste des items (qui contient les colonnes : itemName, cout de glpi, le supercost et le cout total)
Alors la table SuperCost doit avoir : ticketId, ItemId et cout

Get-ChildItem C:\aaa -Recurse -File |
Where-Object {$_.LastWriteTime -gt (Get-Date).AddMinutes(-30)} |
Sort-Object LastWriteTime -Descending |
Select-Object LastWriteTime, FullName