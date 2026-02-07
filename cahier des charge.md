# Cahier des Charges

## Projet : CardForge

---

# 1. Présentation du projet

## 1.1 Nom du projet

CardForge 

## 1.2 Objectif

Développer une application web permettant à un utilisateur de créer une carte personnalisée en relief (3D) et de l’exporter au format STL ou OBJ pour impression 3D.

## 1.3 Finalité

Fournir un outil simple, visuel et interactif permettant de générer un modèle 3D prêt à être imprimé.

---

# 2. Cible

* Makers / possesseurs d’imprimante 3D
* Étudiants en design / tech
* Développeurs souhaitant créer des cartes personnalisées
* Créateurs de jeux ou univers

---

# 3. Périmètre fonctionnel (MVP)

## 3.1 Fonction principale

Création d’une carte 3D personnalisable.

## 3.2 Paramètres modifiables

### Dimensions

* Largeur (mm)
* Hauteur (mm)
* Épaisseur (mm)

### Texte principal

* Nom
* Taille du texte
* Position verticale
* Mode :

  * Relief (emboss)
  * Gravé (engrave)

### Texte secondaire

* Sous-titre
* Taille
* Position

### Cadre (optionnel)

* Activer / désactiver
* Épaisseur du cadre

---

# 4. Fonctionnalités

## 4.1 Visualisation 3D

* Affichage temps réel du modèle
* Rotation à la souris
* Zoom
* Éclairage basique

## 4.2 Génération géométrique

* Base : BoxGeometry
* Texte : TextGeometry extrudé
* Fusion des géométries

## 4.3 Export

* Export en STL
* Export en OBJ
* Fichier compatible impression 3D

---

# 5. Contraintes techniques

## 5.1 Technologies

* Three.js
* STLExporter / OBJExporter
* HTML / CSS / JS
* Option : Vite

## 5.2 Contraintes 3D

* Géométrie manifold
* Pas d’intersections invalides
* Unité en millimètres

---

# 6. Interface utilisateur

## 6.1 Structure

* Colonne gauche : paramètres
* Colonne droite : preview 3D

## 6.2 UX

* Mise à jour en temps réel
* Interface claire
* Bouton export visible

---

# 7. Architecture technique simplifiée

* Scene
* Camera
* Renderer
* Lights
* CardMesh (groupe)

---

# 8. Planning de développement (3 jours)

Jour 1 :

* Setup projet
* Base carte 3D
* Preview interactive

Jour 2 :

* Ajout texte extrudé
* Paramètres dynamiques
* Mode gravé / relief

Jour 3 :

* Export STL
* Nettoyage géométrie
* UI finale

---

# 9. Évolutions futures

* Import SVG pour icônes
* Ajout QR code 3D
* Sauvegarde projet
* Mode premium

---

# 10. Critères de réussite

* Export STL fonctionnel
* Modèle imprimable
* Interface intuitive
* Temps de génération < 2 secondes

---

Fin du cahier des charges.
