* mamindra anle kanban => misy cout vaovao (=super cost) ampidirina (stockena anaty sqlite) : -> terminé
COUT FIXE VAOVAO

* page vaovao misy resaka cout = misy liste items (misy ny cout efa anaty import sy ny cout vaovao (colonne iray))
NB: cout total telephone...
rah ticket iray misy pc 2 => cout/2

cout tany am import | cout 

colonnes affichena : PC | cout glpi | super cost | total

Get-ChildItem C:\aaa -Recurse -File |
Where-Object {$_.LastWriteTime -gt (Get-Date).AddMinutes(-30)} |
Sort-Object LastWriteTime -Descending |
Select-Object LastWriteTime, FullName

Get-ChildItem C:\wamp64\www\glpi -Recurse -File |
Where-Object {$_.LastWriteTime -gt (Get-Date).AddMinutes(-30)} |
Sort-Object LastWriteTime -Descending |
Select-Object LastWriteTime, FullName

-------------------------------------------------------

- page vaovao fanaovana import
atao am import = ireo mouvements nitranga
csv 3 colonnes : ticket|mvt|valeur : 2|open|5 : ticket num 2 atao reopen, 5%;
2|cancel| : annulena ilay ticket num 2; 2|close|100 : terminé avec cost=100
- any amle tableau => cliquer cat laptop (avec 2 items) => item 1 : reouverture = ..., item 2 = ..... <=> details par item