class CreateStudmodules < ActiveRecord::Migration
  def self.up
    create_table :studmodules do |t|
      t.string :name
      t.integer :credits
      t.string :short
      t.text :description
      t.integer :category_id

      t.timestamps

      # Grundkurse
      Studmodule.create :name => "Physik I",
        :credits => 9,
        :short => "B.Phy.101"
      Studmodule.create :name => "Physik II",
        :credits => 9,
        :short => "B.Phy.102"
      Studmodule.create :name => "Physik III",
        :credits => 6,
        :short => "B.Phy.103"
      Studmodule.create :name => "Physik IV",
        :credits => 6,
        :short => "B.Phy.104"
      Studmodule.create :name => "Analytische Mechanik",
        :credits => 8,
        :short => "B.Phy.201"
      Studmodule.create :name => "Quantenmechanik I",
        :credits => 8,
        :short => "B.Phy.202"
      Studmodule.create :name => "Statistische Physik",
        :credits => 8,
        :short => "B.Phy.203"

      # Praktika
      Studmodule.create :name => "Physikalisches Grundpraktikum",
        :credits => 12,
        :short => "B.Phy.410"
      Studmodule.create :name => "Physikalisches Fortgeschrittenenpraktikum",
        :credits => 3,
        :short => "B.Phy.402"

      # Mathematik
      Studmodule.create :name => "Mathematik für Physiker I",
        :credits => 9,
        :short => "B.Phy.303"
      Studmodule.create :name => "Mathematik für Physiker II",
        :credits => 6,
        :short => "B.Phy.304"
      Studmodule.create :name => "Basismodul Analysis I",
        :credits => 9,
        :short => "B.Phy.011"
      Studmodule.create :name => "Basismodul AGLA I",
        :credits => 9,
        :short => "B.Phy.012"

      # Wahlpflicht -> Spezialisierung -> Spez.Praktikum
      Studmodule.create :name => "Spezialisierungspraktikum Nanostrukturphysik",
        :credits => 6,
        :short => "B.Phy.403"
      Studmodule.create :name => "Spezialisierungspraktikum Betreuung von Netzwerken und Netzwerknutzern",
        :credits => 6,
        :short => "B.Phy.404"
      Studmodule.create :name => "Spezialisierungspraktikum Astro- und Geophysik",
        :credits => 6,
        :short => "B.Phy.405"
      Studmodule.create :name => "Spezialisierungspraktikum Biophysik und Physik komplexer Systeme",
        :credits => 6,
        :short => "B.Phy.406"
      Studmodule.create :name => "Spezialisierungspraktikum Festkörper- und Materialphysik",
        :credits => 6,
        :short => "B.Phy.407"
      Studmodule.create :name => "Spezialisierungspraktikum Kern- und Teilchenphysik",
        :credits => 6,
        :short => "B.Phy.408"

      # Einführungen
      Studmodule.create :name => "Einführung in die Astro- und Geophysik",
        :credits => 6,
        :short => "B.Phy.501"
      Studmodule.create :name => "Einführung in die Biophysik und Phsyik komplexer Systeme",
        :credits => 6,
        :short => "B.Phy.502"
      Studmodule.create :name => "Einführung in die Festkörper- und Materialphysik",
        :credits => 6,
        :short => "B.Phy.503"
      Studmodule.create :name => "Einführung in die Kern- und Teilchenphysik",
        :credits => 6,
        :short => "B.Phy.504"
      Studmodule.create :name => "Mehrbenutzersysteme in der Praxis I",
        :credits => 6,
        :short => "B.Phy.510"
      Studmodule.create :name => "Mehrbenutzersysteme in der Praxis II",
        :credits => 6,
        :short => "B.Phy.511"

      # Spezielle Themen

      Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik I",
        :credits => 6,
        :short => "B.Phy.551"
      Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik II",
        :credits => 6,
        :short => "B.Phy.552"
      Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik III",
        :credits => 6,
        :short => "B.Phy.553"
      Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik IV",
        :credits => 6,
        :short => "B.Phy.554"
      Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme I",
        :credits => 6,
        :short => "B.Phy.561"
      Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme II",
        :credits => 6,
        :short => "B.Phy.562"
      Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme III",
        :credits => 6,
        :short => "B.Phy.563"
      Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme IV",
        :credits => 6,
        :short => "B.Phy.564"
      Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik I",
        :credits => 6,
        :short => "B.Phy.571"
      Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik II",
        :credits => 6,
        :short => "B.Phy.572"
      Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik III",
        :credits => 6,
        :short => "B.Phy.573"
      Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik IV",
        :credits => 6,
        :short => "B.Phy.574"
      Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik I",
        :credits => 6,
        :short => "B.Phy.581"
      Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik II",
        :credits => 6,
        :short => "B.Phy.582"
      Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik III",
        :credits => 6,
        :short => "B.Phy.583"
      Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik IV",
        :credits => 6,
        :short => "B.Phy.584"
      Studmodule.create :name => "Spezielle Themen der modernen Physik I",
        :credits => 6,
        :short => "B.Phy.591"
      Studmodule.create :name => "Spezielle Themen der modernen Physik II",
        :credits => 6,
        :short => "B.Phy.592"
      Studmodule.create :name => "Spezielle Themen der modernen Physik III",
        :credits => 6,
        :short => "B.Phy.593"
      Studmodule.create :name => "Spezielle Themen der modernen Physik IV",
        :credits => 6,
        :short => "B.Phy.594"

      # Profilierungsbereich
      
      Studmodule.create :name => "Elektronikpraktikum für Naturwissenschaftler",
        :credits => 6,
        :short => "B.Phy.606"
      Studmodule.create :name => "Mikrobiologie",
        :credits => 10,
        :short => "B.Bio.118"
      Studmodule.create :name => "Biochemie",
        :credits => 10,
        :short => "B.Bio.112"
      Studmodule.create :name => "Interne Unternehmensrechnung",
        :credits => 6,
        :short => "B.Bwl.02"
      Studmodule.create :name => "Jahresabschluss",
        :credits => 6,
        :short => "B.OPH.07"
      Studmodule.create :name => "Produktion und Logistik",
        :credits => 6,
        :short => "B.Bwl.04"
      Studmodule.create :name => "Management der Informationssysteme",
        :credits => 6,
        :short => "B.Win.01"
      Studmodule.create :name => "Informationsverarbeitung in Dienstleistungsbetrieben",
        :credits => 6,
        :short => "B.Win.04"
      Studmodule.create :name => "Programmierung in C# (Grundlagen)",
        :credits => 6,
        :short => "B.Win.23"
      Studmodule.create :name => "Allgemeine und Anorganische Chemie für Physiker",
        :credits => 4,
        :short => "B.Che.9105"
      Studmodule.create :name => "Praktikum Allgemeine und Anorganische Chemie für Physiker",
        :credits => 8,
        :short => "B.Che.9106"
      Studmodule.create :name => "Organische und makromolekulare Chemie für Physiker",
        :credits => 3,
        :short => "B.Che.9108"
      Studmodule.create :name => "Chemisches Gleichgewicht für Physiker",
        :credits => 6,
        :short => "B.Che.1302.1"
      Studmodule.create :name => "Kinetik",
        :credits => 6,
        :short => "B.Che.2301"
      Studmodule.create :name => "Atombau und Chemische Bindung",
        :credits => 4,
        :short => "B.Che.1401"
      Studmodule.create :name => "Grundlagen der Geowissenschaften für Naturwissenschaftler",
        :credits => 12,
        :short => "B.Geo.402"
      
      # Schlüsselkompetenzen
      
      Studmodule.create :name => "Professionalisierungsseminar",
        :credits => 4,
        :short => "B.Phy.602"
      Studmodule.create :name => "Projektpraktikum",
        :credits => 6,
        :short => "B.Phy.604"
      Studmodule.create :name => "Computergestütztes wissenschaftliches Rechnen",
        :credits => 8,
        :short => "B.Phy.605"

    end
  end

  def self.down
    drop_table :studmodules
  end
end
