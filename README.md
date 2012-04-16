# ModulManager

Prüfungsordnung leicht gemacht – Der ModulManager ist eine hochflexible Webanwendung zur Abbildung von Prüfungsordnungen, mit der Studierende ihr Studium einfacher planen können.

Der ModulManager ist freie, quelloffene Software und wurde unter der GNU Affero General Public License 3.0 veröffentlicht (siehe unten).


## Features

- Anordnung der Vorlesungs-Module in Semester per "Drag & Drop"
- Auswertung der Prüfungsvoraussetzungen an Hand der ausgewählten Prüfungsordnung und des ausgewählten Schwerpunktes
- Klare, intuitive Oberfläche
- Erklärung der noch zu erfüllenden Prüfungs-Voraussetzungen durch Info-Button an jedem Modul und jeder Prüfungs-Kategorie
- Berechnung des zu erwartenden Notendurchschnitts
- Export der Auswahl als PDF oder als ModulManager-Datenformat, um später weiter arbeiten zu können
- Ausnahme-Optionen erlauben an jedem Modul die Behandlung von Sonderfällen
- Platzhalter-Module erlauben den Einsatz von in der Prüfungsordnung nicht vorgesehenen Modulen (freie Eingabe)
- Eingabe der Prüfungsordnung in leicht verständlichem Text-Format ([YAML](http://en.wikipedia.org/wiki/YAML)), keine Programmier-Kenntnisse nötig

![Screenshot der Hauptseite des ModulManagers](https://github.com/olavolav/ModulManager/raw/master/screenshot.jpg)


## Demo

Der ModulManager wurde in Zusammenarbeit mit der [Fakultät Physik der Universität Göttingen](http://www.physik.uni-goettingen.de/) entwickelt. Dort ist er zur Zeit auch im Einsatz.
[Starten!](http://ugoe-physik.modulmanager.de)


## Konfiguration

Die Eingabe von Prüfungsordnungen erfolgt über eine Reihe von YAML-Dateien im ModulManager-Verzeichnis `modulmanager/config/basedata/`.

Nehmen wir an, Sie möchten die neue Prüfungsordnung hinzufügen, nennen wir sie `PO_Mai_2012`. Dazu erstellen Sie ein Unterverzeichnis `modulmanager/config/basedata/PO_Mai_2012` mit den folgenden fünf Dateien:

- `beschreibung.yml`
- `module.yml`
- `gruppen.yml`
- `schwerpunkte.yml`
- `vorauswahl.yml`

Diese Dateien wollen wir nun der Reihe nach mit den Informationen der Prüfungsordnung füllen.

### 1. Beschreibung der Prüfungsordnung

Die Datei `beschreibung.yml` enthält generelle Informationen zu dieser Prüfungsordnung. Hier steht das YAML-Schlüsselwort `name` für den Titel der Prüfungsordnung und `kurz` für die Kurz-Bezeichnung. `beschreibung` können Sie nach Belieben verwenden.

````yaml
name: "Version 123 vom 1. Mai 2012 (aktuelle Version)"
kurz: "PO 1. Mai 2012"
pfad: "PO_Mai_2012"
beschreibung: "Dies ist die neue Prüfungsordnung, die wir hinzufügen möchten."
datum: 2012-01-01
````

### 2. Beschreibung der Module

In `module.yml` beschreiben wir alle für diese Prüfungsordnung relevanten Vorlesungs-Module. Ein einfaches Modul könnte etwa folgendermaßen aufgebaut sein:

````yaml
- name: Physik I
  credits: 9
  id: B.Phy.101
  beschreibung: "Lernziele: Einheiten und Messgrößen, Mechanik."
````

Bitte beachten Sie den Strich am Beginn der ersten Zeile – es handelt sich hier um eine Auflistung, auch wenn wir bisher nur ein ein Modul ansehen. Das Beispiel definiert nur den Namen des Moduls, seinen Wert in ETCS-Credits in `credits`, eine Beschreibung und `id`. Letzteres Feld ist zugleich die Kurzbezeichnung des Moduls als auch das Kürzel, mit dem wir zum Beispiel später bei der Definition der Regeln auf dieses Modul verweisen können.

Module können allerdings noch einige weitere Eigenschaften besitzen. Nehmen wir das folgende Modul als Beispiel. Es besteht aus zwei Teilen, die auch in verschiedenen Semestern belegt werden können:

````yaml
- name: Physikalisches Grundpraktikum
  sub-name: ": Grundlagen des Experimentierens"
  credits: 2
  id: B.Phy.410
  beschreibung: "Erstes Teilmodul des physikalischen Grundpraktikums"
  sub-module: B.Phy.410.2
  note: nein

- name: Physikalisches Grundpraktikum
  sub-name: ": Grundpraktikum"
  credits: 10
  id: B.Phy.410.2
  beschreibung: "Zweites Teilmodul des physikalischen Grundpraktikums"
  note: ja
````

Wie Sie sehen, hat das erste Teilmodul nun die zusätzlichen Schlüssel `sub-name` für einen Text, der bei Aufspaltung in die Teilmodule dem Namen des jeweiligen Teilmoduls hinzugefügt wird, und den Schlüssel `sub-module` für den Verweis auf das zweite Teil-Modul.

Wie Sie bestimmt bemerkt haben, haben diese beiden letzten Module auch den Schlüssel `note`. So können benotete und unbenotete Module unterschieden werden.


### 3. Definition der Gruppen und Regeln

Die Datei `gruppen.yml` definiert Modul-Gruppen und die dazugehörigen Regeln, d.h. die Abhängigkeiten und Anforderungen der Prüfungsordnung. Ein Ausschnitt aus einer fertigen, solchen Datei könnte so aussehen:

````yaml
- name: Pflichtmodule
  beschreibung: "Dieser Bereich enthält alle Pflicht-Module."
  untergruppen: "Grundkurs, Praktika, Theorie"
  modus: p

- name: Theorie
  beschreibung: "Hier werden theoretische Grundlagen vermittelt."
  # Beschreibungs-Texte stammen aus §16 StO
  module: "B.Phy.201, B.Phy.202, B.Phy.203"
  anzahl: 3
  credits: 24
  note-streichen: 1
````

Wir definieren also mit `name` betitelte Regel-Kategorien, die entweder mit Hilfe des Schlüssels `untergruppen` von untergeordneten Kategorien abhängen (im obigen Beispiel hat man also die Kategorie "Pflichtmodule" nur erfüllt, wenn man alle der Kategorien "Grundkurs", "Praktika" und "Theorie" erfüllt hat), oder die konkret von der Einbringung bestimmter Module abhängen, wie die Kategorie "Theorie" im obigen Beispiel.

Im ersten Fall werden über `untergruppen` Hierarchien von Kategorien erzeugt, die dann im Überblicks-Feld des ModulManagers als Baum-Struktur dargestellt werden.

Im zweiten Fall, im Fall der direkten Abhängigkeit von einzubringenden Modulen, können Sie über den Schlüssel `module` eine Liste von Modulen eingeben, die in diesen Bereich eingebracht werden können, und Sie können über `anzahl` und `credits` die Mindest-Anzahl bzw. die Mindest-ETCS-Credits fest legen, die in dieser Kategorie erforderlich sind. Im obigen Beispiel sind also alle drei aufgelisteten Module zwingend erforderlich. Diese Tatsache wird visuell im ModulManager durch ein "P" (für Pflicht) and den entsprechenden Modulen gekennzeichnet, wenn Sie dies mit dem Schlüssel `modus: p` festlegen, wie im Beispiel für die Kategorie "Pflichtmodule" geschehen.

Zusätzlich haben wir im Beispiel mit `note-streichen: 1` festgelegt, dass man für ein Modul in diesem Bereich die "Note streichen" kann, d.h. maximal ein Modul aus dieser Kategorie kann von der Notenberechnung ausgenommen werden, um den Gesamt-Notenschnitt zu verbessern.

Wie Sie auch sehen, können Sie nach Belieben mit dem Zeichen `#` Kommentare einfügen, die vom ModulManager ignoriert werden.


### 4. Definition der Schwerpunkte

`schwerpunkte.yml` beschreibt die für diese Prüfungsordnung wählbaren Schwerpunkte und definiert die zugehörigen Anforderungen.

````yaml
- name: Nanostrukturphysik
  beschreibung:
  kategorien:

    - name: Pflicht
      module: B.Phy.503, B.Phy.403
      anzahl: 2
      credits: 12
      modus: wp

    - name: Profilierungsbereich
      module: B.Bwl.02, B.OPH.07, B.Bwl.04
      anzahl: 1
      credits: 6
      modus: wp
````

Die Beschreibung der Kategorien funktioniert analog zu den Angaben in `gruppen.yml`, nur hier eben einmal pro Schwerpunkt.


### 5. Die Standard-Auswahl

`vorauswahl.yml` ist eine Auflistung der beim Start des ModulManagers bereits eingetragenen Module, also eine Standard-Konfiguration, die den Einstieg in den ModulManager erleichtern soll. Im Feld `semester1` tragen wir die Module ein, die beim Starten des ModulManagers im ersten Semester erscheinen sollen, in `semester2` diejenigen für das 2. Semester usw.

````yaml
- name: standard
  semester1: B.Phy.101, B.Mat.011, B.Mat.012, B.Phy.605
  semester2: B.Phy.102, B.Phy.410, B.Phy.605.2

- name: Nanostrukturphysik
  semester1: B.Phy.101, B.Mat.011, B.Mat.012, B.Phy.605
  semester2: B.Phy.102, B.Phy.410, B.Phy.303, B.Phy.605.2
````

Die Modul-Auflistung mit dem Namen `standard` bezeichnet dabei die Vorauswahl ohne ausgewählten Schwerpunkt.


### 6. Starten des Regel-Parsers

Wenn Sie die Daten Ihrer Prüfungsordnung in die soeben beschriebenen Dateien eingegeben haben, müssen sie nur noch mit dem Browser das Unterverzeichnis `http://(adresse_ihres_modulmanagers)/regel_parser/start` aufrufen. Diese Seite startet dann entweder sofort den Regel-Parser, oder sie nimmt zunächst eine Reinigung des Systems vor, falls zuvor schon Regeln definiert waren.


## Rechtliches

ModulManager is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

ModulManger is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with ModulManger.  If not, see [this page](http://www.gnu.org/licenses/)
