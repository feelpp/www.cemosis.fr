---
title: "Brain Organ-on-Chip"
description: "Microscopie, suivi cellulaire et modèles numériques pour les expériences de cerveau sur puce."
lang: "fr"
slug: "brain-organ-on-chip"
domains: [health]
topics: [modeling, simulation, optimization, signal-image, data-processing, digital-twin, uncertainty-quantification]
category: "Collaboration de recherche · D3 4Health"
period: "Janvier 2025–2027"
image: "/images/brain-organ-on-chip/chip.png"
imageAlt: "Puce cérébrale entre des doigts gantés."
imageCaption: "Dispositif expérimental de puce cérébrale, issu de la présentation du projet."
order: 7
---

## De la microscopie au modèle numérique

Brain Organ-on-Chip relie les expériences de microscopie aux modèles mathématiques des interactions entre cellules tumorales et astrocytes. L’objectif est une chaîne reproductible transformant les observations expérimentales en modèles numériques calibrés et prédictifs, sur la géométrie de la puce.

## Méthodes

- Recaler les images de microscopie et les régions d’intérêt dans le repère de la puce.
- Détecter et suivre les cellules dans les séquences confocales ; analyser déplacement, vitesse et alignement.
- Reconstruire des champs continus de densité cellulaire à partir des trajectoires par estimation à noyau (KDE).
- Simuler les densités cellulaires, les signaux chimiques et l’oxygène par des équations aux dérivées partielles et les méthodes HDG/CFPDE de Feel++.
- Calibrer les paramètres à partir d’observables comparables, avec analyse d’identifiabilité et quantification des incertitudes.

## Collaboration

Ces travaux s’inscrivent dans une collaboration italienne dans le contexte de **D3 4Health** (Digital Driven Diagnostics, Prognostics and Therapeutics for Sustainable Healthcare), une initiative italienne PNC/PNRR sur les jumeaux numériques et biologiques pour la santé.

La présentation cite **G. Bretti, S. Bertoluzza, M. Pennacchio, A. De Giorgi et F. Gervaso**, avec **CNR-NANOTEC** parmi les collaborateurs. **Christophe Prud’homme** contribue pour Cemosis / Université de Strasbourg.

## État des travaux

La présentation de juillet 2026 indique que les données confocales, une chaîne d’analyse d’images et de suivi cellulaire, ainsi qu’un cas EDP de puce cérébrale sont disponibles. Le recalage et la reconstruction de densités du micro au macro sont en développement. La reconstruction tridimensionnelle, la calibration cohérente avec les observations et l’analyse bayésienne des incertitudes constituent des objectifs de développement.
