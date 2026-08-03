# Alarm Modern Card

Carte Lovelace moderne pour système d'alarme. Anneau d'état avec compte à rebours,
contrôle segmenté (désarmé/nuit/total), clavier pour code, couverture d'armement 24 h,
zones, catégories incendie et capteurs repliables.

## Sécurité

Helper `esc()` appliqué à toutes les interpolations de données dynamiques dans
`innerHTML`. Rejet de `script.*` et `automation.*` dans `callService`.

## Installation

HACS → Dépôts personnalisés → `https://github.com/junkoku38/alarm-modern-card`, catégorie Lovelace.

## Configuration

```yaml
type: custom:alarm-modern-card
name: Alarme
alarm: alarm_control_panel.maison
exit_delay: 45
entry_delay: 30
show_coverage: true
show_zones: true
battery_warning: 30
zones:
  - entity: binary_sensor.porte_entree
    name: Porte d'entrée
    type: door
fire:
  - entity: binary_sensor.detecteur_fumee
    name: Salon
    temperature: sensor.detecteur_fumee_temperature
sensors:
  - entity: sensor.capteur_batterie
    name: Capteur entrée
    temperature: sensor.capteur_temperature
links:
  - entity: sensor.hub_batterie
    label: Hub
modes:
  - name: Désarmé
    service: alarm_disarm
    state: disarmed
    icon: shieldOpen
  - name: Nuit
    service: alarm_arm_night
    state: armed_night
    icon: moon
  - name: Total
    service: alarm_arm_away
    state: armed_away
    icon: shieldLock
```

## Licence

MIT
