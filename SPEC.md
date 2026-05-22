# CloudVault Premium - Clone MEGA.nz

## 1. Project Overview

**Project Name**: CloudVault Premium
**Type**: Cloud Storage Web Application (Clone MEGA.nz complet)
**Core Functionality**: Plateforme de stockage cloud complète style MEGA.nz avec stockage illimité, connexion Google obligatoire, corbeille avec récupération, et toutes les fonctionnalités MEGA.

## 2. Design System (Style MEGA.nz)

### Color Palette
- Primary: #d32f2f (Rouge MEGA)
- Secondary: #ff6f61 (Rouge clair)
- Background: #ffffff (Blanc)
- Dark Background: #263238 (Gris foncé)
- Surface: #f5f5f5 (Gris clair)
- Text: #212121 (Noir)
- Muted: #757575 (Gris)
- Success: #4caf50 (Vert)

## 3. Functional Specification

### Authentication
- **Google OAuth obligatoire**: Connexion requise pour accéder
- **Profil utilisateur**: Affichage photo/nom Google
- **Déconnexion**: Possible via paramètres

### File Management
- **Upload**: Drag & drop + bouton, progression
- **Download**: Téléchargement fichiers
- **Rename**: Renommage inline
- **Move**: Déplacement entre dossiers
- **Delete**: Suppression vers Trash
- **Preview**: Prévisualisation images/vidéos

### Trash System (Corbeille)
- **Suppression**: Fichiers envoyés en Trash
- **Restauration**: Récupération depuis Trash
- **Suppression définitive**: Via Settings > Empty Trash
- **Récupérer tout**: Bouton restaurer tous

### Settings (Paramètres)
- **Profil**: Infos Google
- **Storage**: Affichage illimité
- **Trash Management**:
  - Nombre de fichiers dans Trash
  - "Empty Trash" (supprimer définitivement)
  - "Restore All" (récupérer tous)
  - "Restore" par fichier
  - "Delete Permanently" par fichier

### Additional MEGA Features
- **Favoris**: Marquer fichiers favoris
- **Albums photos**: Organisation images en albums
- **Partenaires**: Accès fichiers partenaires
- **Partage de liens**: Liste liens créés

## 4. Acceptance Criteria

1. ✅ Connexion Google obligatoire
2. ✅ Design identique MEGA.nz
3. ✅ Sidebar navigation complète MEGA
4. ✅ Upload drag & drop avec progression
5. ✅ Vue grille/liste fichiers
6. ✅ Trash avec restauration
7. ✅ Settings avec gestion Trash
8. ✅ Suppression définitive Trash
9. ✅ Partage fichiers avec liens
10. ✅ Stockage illimité affiché
11. ✅ Favoris, Albums, Partenaires
12. ✅ Persistance localStorage