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
Where-Object {$_.LastWriteTime -gt (Get-Date).AddMinutes(-90)} |
Sort-Object LastWriteTime -Descending |
Select-Object LastWriteTime, FullName

-------------------------------------------------------

- page vaovao fanaovana import
atao am import = ireo mouvements nitranga
csv 3 colonnes : ticket|mvt|valeur : 2|open|5 : ticket num 2 atao reopen, 5%;
2|cancel| : annulena ilay ticket num 2; 2|close|100 : terminé avec cost=100
- any amle tableau => cliquer cat laptop (avec 2 items) => item 1 : reouverture = ..., item 2 = ..... <=> details par item


-------------------------------------------------------

mode de calcul ny ficalculena anle pourcentage de reouverture
- mode 1 = ilay cout farany no alaina
- mode 2 = ilay voalohany no alaina
- mode 3 = ny moyenne anle cout rehetra hatramzay. Ex : 50 et 100 => 75 => 7.5 = cout de rouverture
- mode 4 = somme de tous les couts . Ex : 50 + 100 = 150 => 150*10/10

zone de liste : 1, 2, 3, 4 (eo akaikinleh input pourcentage)

nouvelle colonne : "mode" (am reouverture ihany no misy mode)


----------------------------------------------------------

code source + video

- page vaovao = liste de toutes les reouvertures et supercosts
=> misy bouton "modifier" -> afaka ovaina le chiffre (pourcentage) sy mode ary ny syperCost rehetra -> validena -> mirecalcule
=> afaka fafana ihany koa ny reouverture (mety misy close mitohitohy zany) 

200 close
ouv
100 cl
ouv