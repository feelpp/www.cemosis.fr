---
title: "Brain Organ-on-Chip"
description: "Microscopy, cell tracking and numerical models for brain organ-on-chip experiments."
lang: "en"
slug: "brain-organ-on-chip"
domains: [health]
topics: [modeling, simulation, optimization, signal-image, data-processing, digital-twin, uncertainty-quantification]
category: "Research collaboration · D3 4Health"
period: "January 2025–2027"
image: "/images/brain-organ-on-chip/chip.png"
imageAlt: "Brain organ-on-chip held between gloved fingers."
imageCaption: "Brain organ-on-chip experimental device, from the project presentation."
order: 7
---

## From microscopy to a digital model

Brain Organ-on-Chip connects microscopy experiments with mathematical models of interactions between tumour cells and astrocytes. The objective is a reproducible pipeline that turns experimental observations into calibrated, predictive digital models on the geometry of the chip.

## Methods

- Register microscopy images and regions of interest in the chip coordinate system.
- Detect and track cells in confocal image sequences; analyse displacement, speed and alignment.
- Reconstruct continuous cell-density fields from trajectories using kernel density estimation (KDE).
- Simulate cell densities, chemical signals and oxygen using partial differential equations and Feel++ HDG/CFPDE methods.
- Calibrate model parameters from comparable observables, with identifiability analysis and uncertainty quantification.

## Collaboration

The work is part of an Italian collaboration in the **D3 4Health** context (Digital Driven Diagnostics, Prognostics and Therapeutics for Sustainable Healthcare), an Italian PNC/PNRR initiative on digital and biological twins for healthcare.

The presentation names **G. Bretti, S. Bertoluzza, M. Pennacchio, A. De Giorgi and F. Gervaso**, with **CNR-NANOTEC** among the collaborators. **Christophe Prud’homme** contributes for Cemosis / University of Strasbourg.

## Development status

The July 2026 presentation reports available confocal data, an existing image-analysis and tracking workflow, and a brain organ-on-chip PDE case. Coordinate registration and micro-to-macro density reconstruction are under development. Three-dimensional reconstruction, observation-consistent calibration and Bayesian uncertainty analysis are further development objectives.
