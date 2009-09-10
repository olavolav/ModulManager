class AddDataToStudmodules < ActiveRecord::Migration
  def self.up
    # Bachelor-Arbeit
      Studmodule.create :name => "Bachelor-Arbeit",
        :credits => 12,
        :short => "",
        :category => Category.find(:first, :conditions => "name = 'Bachelor-Arbeit'")
    # Grundkurse
      Studmodule.create :name => "Physik I",
        :credits => 9,
        :short => "B.Phy.101",
        :category => Category.find(:first, :conditions => "name = 'Grundkurse'")
      Studmodule.create :name => "Physik II",
        :credits => 9,
        :short => "B.Phy.102",
        :category => Category.find(:first, :conditions => "name = 'Grundkurse'")
      Studmodule.create :name => "Physik III",
        :credits => 6,
        :short => "B.Phy.103",
        :category => Category.find(:first, :conditions => "name = 'Grundkurse'")
      Studmodule.create :name => "Physik IV",
        :credits => 6,
        :short => "B.Phy.104",
        :category => Category.find(:first, :conditions => "name = 'Grundkurse'")
      Studmodule.create :name => "Analytische Mechanik",
        :credits => 8,
        :short => "B.Phy.201",
        :category => Category.find(:first, :conditions => "name = 'Grundkurse'")
      Studmodule.create :name => "Quantenmechanik I",
        :credits => 8,
        :short => "B.Phy.202",
        :category => Category.find(:first, :conditions => "name = 'Grundkurse'")
      Studmodule.create :name => "Statistische Physik",
        :credits => 8,
        :short => "B.Phy.203",
        :category => Category.find(:first, :conditions => "name = 'Grundkurse'")

      # Praktika
      Studmodule.create :name => "Physikalisches Grundpraktikum",
        :credits => 12,
        :short => "B.Phy.410",
        :category => Category.find(:first, :conditions => "name = 'Praktika'")
      Studmodule.create :name => "Physikalisches Fortgeschrittenenpraktikum",
        :credits => 3,
        :short => "B.Phy.402",
        :category => Category.find(:first, :conditions => "name = 'Praktika'")

      # Mathematik
      Studmodule.create :name => "Mathematik für Physiker I",
        :credits => 9,
        :short => "B.Phy.303",
        :category => Category.find(:first, :conditions => "name = 'Mathematik'")
      Studmodule.create :name => "Mathematik für Physiker II",
        :credits => 6,
        :short => "B.Phy.304",
        :category => Category.find(:first, :conditions => "name = 'Mathematik'")
      Studmodule.create :name => "Basismodul Analysis I",
        :credits => 9,
        :short => "B.Mat.011",
        :category => Category.find(:first, :conditions => "name = 'Mathematik'")
      Studmodule.create :name => "Basismodul AGLA I",
        :credits => 9,
        :short => "B.Mat.012",
        :category => Category.find(:first, :conditions => "name = 'Mathematik'")

      # Wahlpflicht -> Spezialisierung -> Spez.Praktikum
      Studmodule.create :name => "Spezialisierungspraktikum Nanostrukturphysik",
        :credits => 6,
        :short => "B.Phy.403",
        :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      Studmodule.create :name => "Spezialisierungspraktikum Betreuung von Netzwerken und Netzwerknutzern",
        :credits => 6,
        :short => "B.Phy.404",
        :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      Studmodule.create :name => "Spezialisierungspraktikum Astro- und Geophysik",
        :credits => 6,
        :short => "B.Phy.405",
        :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      Studmodule.create :name => "Spezialisierungspraktikum Biophysik und Physik komplexer Systeme",
        :credits => 6,
        :short => "B.Phy.406",
        :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      Studmodule.create :name => "Spezialisierungspraktikum Festkörper- und Materialphysik",
        :credits => 6,
        :short => "B.Phy.407",
        :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      Studmodule.create :name => "Spezialisierungspraktikum Kern- und Teilchenphysik",
        :credits => 6,
        :short => "B.Phy.408",
        :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")

      # Einf&uuml;hrungen
      Studmodule.create :name => "Einführung in die Astro- und Geophysik",
        :credits => 6,
        :short => "B.Phy.501",
        :category => Category.find(:first, :conditions => "name = 'Einführungen'")
      Studmodule.create :name => "Einführung in die Biophysik und Phsyik komplexer Systeme",
        :credits => 6,
        :short => "B.Phy.502",
        :category => Category.find(:first, :conditions => "name = 'Einführungen'")
      Studmodule.create :name => "Einführung in die Festkörper- und Materialphysik",
        :credits => 6,
        :short => "B.Phy.503",
        :category => Category.find(:first, :conditions => "name = 'Einführungen'")
      Studmodule.create :name => "Einführung in die Kern- und Teilchenphysik",
        :credits => 6,
        :short => "B.Phy.504",
        :category => Category.find(:first, :conditions => "name = 'Einführungen'")
      Studmodule.create :name => "Mehrbenutzersysteme in der Praxis I",
        :credits => 6,
        :short => "B.Phy.510",
        :category => Category.find(:first, :conditions => "name = 'Einführungen'")
      Studmodule.create :name => "Mehrbenutzersysteme in der Praxis II",
        :credits => 6,
        :short => "B.Phy.511",
        :category => Category.find(:first, :conditions => "name = 'Einführungen'")

      # Spezielle Themen

      Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik I",
        :credits => 6,
        :short => "B.Phy.551",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik II",
        :credits => 6,
        :short => "B.Phy.552",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik III",
        :credits => 6,
        :short => "B.Phy.553",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik IV",
        :credits => 6,
        :short => "B.Phy.554",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme I",
        :credits => 6,
        :short => "B.Phy.561",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme II",
        :credits => 6,
        :short => "B.Phy.562",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme III",
        :credits => 6,
        :short => "B.Phy.563",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme IV",
        :credits => 6,
        :short => "B.Phy.564",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik I",
        :credits => 6,
        :short => "B.Phy.571",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik II",
        :credits => 6,
        :short => "B.Phy.572",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik III",
        :credits => 6,
        :short => "B.Phy.573",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik IV",
        :credits => 6,
        :short => "B.Phy.574",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik I",
        :credits => 6,
        :short => "B.Phy.581",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik II",
        :credits => 6,
        :short => "B.Phy.582",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik III",
        :credits => 6,
        :short => "B.Phy.583",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik IV",
        :credits => 6,
        :short => "B.Phy.584",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der modernen Physik I",
        :credits => 6,
        :short => "B.Phy.591",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der modernen Physik II",
        :credits => 6,
        :short => "B.Phy.592",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der modernen Physik III",
        :credits => 6,
        :short => "B.Phy.593",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      Studmodule.create :name => "Spezielle Themen der modernen Physik IV",
        :credits => 6,
        :short => "B.Phy.594",
        :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")

      # Profilierungsbereich

      Studmodule.create :name => "Elektronikpraktikum für Naturwissenschaftler",
        :credits => 6,
        :short => "B.Phy.606",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Mikrobiologie",
        :credits => 10,
        :short => "B.Bio.118",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Biochemie",
        :credits => 10,
        :short => "B.Bio.112",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Interne Unternehmensrechnung",
        :credits => 6,
        :short => "B.Bwl.02",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Jahresabschluss",
        :credits => 6,
        :short => "B.OPH.07",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Produktion und Logistik",
        :credits => 6,
        :short => "B.Bwl.04",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Management der Informationssysteme",
        :credits => 6,
        :short => "B.Win.01",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Informationsverarbeitung in Dienstleistungsbetrieben",
        :credits => 6,
        :short => "B.Win.04",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Programmierung in C# (Grundlagen)",
        :credits => 6,
        :short => "B.Win.23",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Allgemeine und Anorganische Chemie für Physiker",
        :credits => 4,
        :short => "B.Che.9105",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Praktikum Allgemeine und Anorganische Chemie für Physiker",
        :credits => 8,
        :short => "B.Che.9106",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Organische und makromolekulare Chemie für Physiker",
        :credits => 3,
        :short => "B.Che.9108",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Chemisches Gleichgewicht für Physiker",
        :credits => 6,
        :short => "B.Che.1302.1",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Kinetik",
        :credits => 6,
        :short => "B.Che.2301",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Atombau und Chemische Bindung",
        :credits => 4,
        :short => "B.Che.1401",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      Studmodule.create :name => "Grundlagen der Geowissenschaften für Naturwissenschaftler",
        :credits => 12,
        :short => "B.Geo.402",
        :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")

      # Schl&uuml;sselkompetenzen

      Studmodule.create :name => "Professionalisierungsseminar",
        :credits => 4,
        :short => "B.Phy.602",
        :category => Category.find(:first, :conditions => "name = 'Schlüsselkompetenzen'")
      Studmodule.create :name => "Projektpraktikum",
        :credits => 6,
        :short => "B.Phy.604",
        :category => Category.find(:first, :conditions => "name = 'Schlüsselkompetenzen'")
      Studmodule.create :name => "Computergestütztes wissenschaftliches Rechnen",
        :credits => 8,
        :short => "B.Phy.605",
        :category => Category.find(:first, :conditions => "name = 'Schlüsselkompetenzen'")
  end

  def self.down
  end
end
