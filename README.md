# data-IdRef

[![build-test-pubtodockerhub](https://github.com/abes-esr/data-idref/actions/workflows/build-test-pubtodockerhub.yml/badge.svg)](https://github.com/abes-esr/data-idref/actions/workflows/build-test-pubtodockerhub.yml) [![Docker Pulls](https://img.shields.io/docker/pulls/abesesr/idref.svg)](https://hub.docker.com/r/abesesr/idref/)

Ce dépôt héberge le code source du site web data.idref.fr.

Dans le triple store d'IdRef, vous trouverez les notices d’autorité IdRef et les publications et références bibliographiques liées à une autorité IdRef en provenance des catalogues et gisements documentaires suivants : 
Sudoc, Calames, Theses.fr, BnF, Scienceplus, Cairn, OpenEdition, etc.

L'ensemble des données d'autorité d'IdRef sont converties sous la forme de triplets RDF.

Tous les types d'autorité sont présents : Personnes, Collectivités, Noms Communs (Rameau et FMeSH), Noms géographiques, Familles et Titres et même les Notices de regroupement (préfiguration du modèle WOEMI).

Toutes les publications et références documentaires sont présentes sous la forme d’une URI, d’un rôle, d'une date de publication et d’une citation bibliographique ou d'un titre (voir selon les corpus) et des liens aux autorités sous la forme de concepts, de contribution, etc.

NB : Le Sudoc constitue un cas particulier car la modélisation de ses ressources documentaires est plus riche que pour les autres gisements. De plus, le Sudoc est le vecteur des alignements des ressources theses.fr et BnF avec IdRef.

URL publique : [https://data.idref.fr/](https://data.idref.fr/)

![logo data.idref.fr](https://data.idref.fr/img/logo-data-idref.png)

Ce site web peut être déployé via Docker à l'aide du dépôt https://github.com/abes-esr/idref-docker

## Virtuoso comme Triple store

Ce site web utilise une base RDF Virtuoso.

La configuration de cette base Virtuoso n'est pas actuellement déposée sur GitHub.

La base Virtuoso utilisée s'appelle tulipe2-dev en dév/test, et tulipe2 en production.

## Synchronisation des données

Le batch qui synchronise les données de la base XML vers le virtuoso data.idref.fr fait partie de l'application historique idref, et se déploie avec le job Jenkins interne idref.fr .

Des jobs WORME alimentent aussi le virtuoso : 

### Principe de fonctionnement de ces jobs WORME : 

- "Enrichissement" :
 
Boîte Worme qui moissonnent des API, des OAI-PMH (format XML), des dumps sur Verveine. Exemples de gisements externes moissonnées : HAL, ZBMath etc.

Ces données sont stockées dans la base Oracle du Hub, dans un format RDF.  

Ces données sont aussi copiées dans la base de travail (BT) Virtuoso du Hub : Tulipe7.

Ensuite, elles sont alignées par d'autres jobs WORME, en utilisant Qualinca, qualincache (Heuristique : DOI Joint)

- "Alignement" :  

D'autres jobs PROD_FROM_BT_* (NOM gisement) _ xx utilisent les données de la BT Virtuoso

Ces jobs utilisent le Virtuoso Alibabase pour effectuer d'autres alignements, qui sont ensuite reversés dans la BT.  

Les alignements cibles sont : IdRef / Orcid / adresses Mail.  

_Il y a un graphe "ALL" contenant tout le contenu d'un gisement (ex : ZBMath)._  

Une fois ces alignements faits, les données sont injectées dans le Virtuoso de data.idref.fr.  


__A noter__ : il serait possible de repartir d'une base Virtuoso vide pour recharger ces graphes dans data.idref.fr. Il faudrait créer un job WORME spécifique pour cela.  


## Restauration du Triple store

Aller sur tulipe2 (login devel)  

```
cd /backup-virtuoso/
ll -th
``` 

Une sauvegarde est faite par jour. Puis des incrémentales toutes les 3 heures.

Aller sur tulipe2-dev (login devel)

Aller dans /home/devel/backup/ puis copier les fichiers de sauvegarde et le fichier de configuration : 

`rsync -av tulipe2.v104.abes.fr:/backup-virtuoso/ ./`

Le login devel a les droits pour arrêter (et démarrer) virtuoso :
```
sudo systemctl stop virtuoso.service
sudo systemctl status virtuoso.service  
```
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
