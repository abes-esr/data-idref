# Data-IdRef

Fiche d'exploitation initiale : 
https://abesfr.sharepoint.com/:w:/r/sites/Bouda/ExploitMaint/Documentation/_layouts/15/Doc.aspx?sourcedoc=%7BFD356270-136D-4443-9E73-3637773B0F23%7D&file=DocExploit_TSIdRef.docx&action=default&mobileredirect=true&DefaultItemOpen=1

Schéma d'architecture : 
https://urbanisation.abes.fr/web/?view=9c67f025-bc62-4870-a6d0-d33f9c792198

2 Virtuosos existent : tulipe2 et tulipe2-dev 
Voir : https://urbanisation.abes.fr/web/?view=062a68ac

Un job Jenkins permet le déploiement du site data.idref.fr

Le batch qui synchronise les données de la base XML vers le virtuoso data.idref.fr fait partie d'idref, et se déploie avec le job Jenkins idref.fr .

Des jobs WORME alimentent aussi le virtuoso : 

Principe de fonctionnement de ces jobs WORME : 

"Enrichissement" :  
Boîte Worme qui moissonnent des API, des OAI-PMH (format XML), des dumps sur Verveine (pour info, Worme a accès à des scripts sh sur Verveine). Exemples de gisements externes moissonnées : HAL, ZBMath etc.  
Ces données sont stockées dans la base Oracle du Hub, dans un format RDF.  
Ces données sont aussi copiées dans la base de travail (BT) Virtuoso du Hub : Tulipe7.  
Ensuite, elles sont alignés par d'autres jobs WORME, en utilisant Qualinca, qualincache (Heuristique : DOI Joint)

"Alignement" :  
D'autres jobs PROD_FROM_BT_* (NOM gisement) _ xx utilisent les données de la BT Virtuoso  
Ces jobs utilisent le Virtuoso Alibabase pour effectuer d'autres alignements, qui sont ensuite reversés dans la BT.  
Les alignements cibles sont : IdRef / Orcid / adresses Mail.  
_Il y a un graphe "ALL" contenant tout le contenu d'un gisement (ex : ZBMath)._  
Une fois ces alignements faits, les données sont injectées dans le Virtuoso de data.idref.fr.  

Il serait possible de repartir une base Virtuoso vide pour recharger ces graphes dans data.idref.fr. Il faudrait créer un job WORME spécifique pour cela.  

## Restauration

Aller sur tulipe2 avec devel  (manger 5 fruits...)  
cd /backup-virtuoso/  
ll -th  

Une sauvegarde est faite par jour. Puis des incrémentales toutes les 3 heures.

Aller sur tulipe2-dev avec devel (manger 5 fruits...)  
Aller dans /home/devel/backup/ puis copier les fichiers de sauvegarde et le fichier de configuration : 

`rsync -av tulipe2.v104.abes.fr:/backup-virtuoso/ ./`

Le login devel a les droits pour arrêter (et démarrer) virtuoso :  
sudo systemctl stop virtuoso.service   
sudo systemctl status virtuoso.service  

Supprimer les anciens fichiers DB : 
```
cd /usr/local/virtuoso-opensource/var/lib/virtuoso/db/
rm -f *.trx
rm -f *.db
```


Aller dans le répertoire /home/devel/backup/ :  
Puis :  
`/usr/local/virtuoso-opensource/bin/virtuoso-t -c /usr/local/virtuoso-opensource/var/lib/virtuoso/db/virtuoso.ini +restore-backup 20241209_200001_`

Redémarrer le virtuoso :  
`sudo systemctl start virtuoso.service`

Le service virtuoso doit répondre en 30 secondes à l'adresse : http://tulipe2-dev.v212.abes.fr:8890/sparql/

Si ce n'est pas le cas (plusieurs heures sans activité), le dump peut être corrompu. Dans ce cas, prendre un dump antérieur.  

