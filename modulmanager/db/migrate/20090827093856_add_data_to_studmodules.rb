class AddDataToStudmodules < ActiveRecord::Migration
  def self.up
    # Bachelor-Arbeit
      s1 = Studmodule.create :name => "Bachelor-Arbeit",
        :credits => 12,
        :short => ""
      s1.categories << Category.find(:first, :conditions => "name = 'Bachelor-Arbeit'")
      s1.save
    # Grundkurse
      s1 = Studmodule.create :name => "Physik I",
        :credits => 9,
        :short => "B.Phy.101"
      s1.categories << Category.find(:first, :conditions => "name = 'Grundkurse'")
      s1.save
      s1 = Studmodule.create :name => "Physik II",
        :credits => 9,
        :short => "B.Phy.102"
      s1.categories << Category.find(:first, :conditions => "name = 'Grundkurse'")
      s1.save
      s1 = Studmodule.create :name => "Physik III",
        :credits => 6,
        :short => "B.Phy.103"
      s1.categories << Category.find(:first, :conditions => "name = 'Grundkurse'")
      s1.save
      s1 = Studmodule.create :name => "Physik IV",
        :credits => 6,
        :short => "B.Phy.104"
      s1.categories << Category.find(:first, :conditions => "name = 'Grundkurse'")
      s1.save
      s1 = Studmodule.create :name => "Analytische Mechanik",
        :credits => 8,
        :short => "B.Phy.201"
      s1.categories << Category.find(:first, :conditions => "name = 'Grundkurse'")
      s1.save
      s1 = Studmodule.create :name => "Quantenmechanik I",
        :credits => 8,
        :short => "B.Phy.202"
      s1.categories << Category.find(:first, :conditions => "name = 'Grundkurse'")
      s1.save
      s1 = Studmodule.create :name => "Statistische Physik",
        :credits => 8,
        :short => "B.Phy.203"
      s1.categories << Category.find(:first, :conditions => "name = 'Grundkurse'")
      s1.save

      # Praktika
      s1 = Studmodule.create :name => "Physikalisches Grundpraktikum",
        :credits => 12,
        :short => "B.Phy.410"
      s1.categories << Category.find(:first, :conditions => "name = 'Praktika'")
      s1.save
      s1 = Studmodule.create :name => "Physikalisches Fortgeschrittenenpraktikum",
        :credits => 3,
        :short => "B.Phy.402"
      s1.categories << Category.find(:first, :conditions => "name = 'Praktika'")
      s1.save

      # Mathematik
      s1 = Studmodule.create :name => "Mathematik für Physiker I",
        :credits => 9,
        :short => "B.Phy.303"
      s1.categories << Category.find(:first, :conditions => "name = 'Mathematik'")
      s1.save
      s1 = Studmodule.create :name => "Mathematik für Physiker II",
        :credits => 6,
        :short => "B.Phy.304"
      s1.categories << Category.find(:first, :conditions => "name = 'Mathematik'")
      s1.save
      s1 = Studmodule.create :name => "Basismodul Analysis I",
        :credits => 9,
        :short => "B.Mat.011"
      s1.categories << Category.find(:first, :conditions => "name = 'Mathematik'")
      s1.save
      s1 = Studmodule.create :name => "Basismodul AGLA I",
        :credits => 9,
        :short => "B.Mat.012"
      s1.categories << Category.find(:first, :conditions => "name = 'Mathematik'")
      s1.save

      # Wahlpflicht -> Spezialisierung -> Spez.Praktikum
      s1 = Studmodule.create :name => "Spezialisierungspraktikum Nanostrukturphysik",
        :credits => 6,
        :short => "B.Phy.403"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      s1.save
      s1 = Studmodule.create :name => "Spezialisierungspraktikum Betreuung von Netzwerken und Netzwerknutzern",
        :credits => 6,
        :short => "B.Phy.404"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      s1.save
      s1 = Studmodule.create :name => "Spezialisierungspraktikum Astro- und Geophysik",
        :credits => 6,
        :short => "B.Phy.405"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      s1.save
      s1 = Studmodule.create :name => "Spezialisierungspraktikum Biophysik und Physik komplexer Systeme",
        :credits => 6,
        :short => "B.Phy.406"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      s1.save
      s1 = Studmodule.create :name => "Spezialisierungspraktikum Festkörper- und Materialphysik",
        :credits => 6,
        :short => "B.Phy.407"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      s1.save
      s1 = Studmodule.create :name => "Spezialisierungspraktikum Kern- und Teilchenphysik",
        :credits => 6,
        :short => "B.Phy.408"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
      s1.save

      # Einf&uuml;hrungen
      s1 = Studmodule.create :name => "Einführung in die Astro- und Geophysik",
        :credits => 6,
        :short => "B.Phy.501"
      s1.categories << Category.find(:first, :conditions => "name = 'Einführungen'")
      s1.save
      s1 = Studmodule.create :name => "Einführung in die Biophysik und Phsyik komplexer Systeme",
        :credits => 6,
        :short => "B.Phy.502"
      s1.categories << Category.find(:first, :conditions => "name = 'Einführungen'")
      s1.save
      s1 = Studmodule.create :name => "Einführung in die Festkörper- und Materialphysik",
        :credits => 6,
        :short => "B.Phy.503"
      s1.categories << Category.find(:first, :conditions => "name = 'Einführungen'")
      s1.save
      s1 = Studmodule.create :name => "Einführung in die Kern- und Teilchenphysik",
        :credits => 6,
        :short => "B.Phy.504"
      s1.categories << Category.find(:first, :conditions => "name = 'Einführungen'")
      s1.save
      s1 = Studmodule.create :name => "Mehrbenutzersysteme in der Praxis I",
        :credits => 6,
        :short => "B.Phy.510"
      s1.categories << Category.find(:first, :conditions => "name = 'Einführungen'")
      s1.save
      s1 = Studmodule.create :name => "Mehrbenutzersysteme in der Praxis II",
        :credits => 6,
        :short => "B.Phy.511"
      s1.categories << Category.find(:first, :conditions => "name = 'Einführungen'")
      s1.save

      # Spezielle Themen

      s1 = Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik I",
        :credits => 6,
        :short => "B.Phy.551"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik II",
        :credits => 6,
        :short => "B.Phy.552"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik III",
        :credits => 6,
        :short => "B.Phy.553"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Astro- und Geophysik IV",
        :credits => 6,
        :short => "B.Phy.554"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme I",
        :credits => 6,
        :short => "B.Phy.561"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme II",
        :credits => 6,
        :short => "B.Phy.562"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme III",
        :credits => 6,
        :short => "B.Phy.563"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Biophysik und Physik komplexer Systeme IV",
        :credits => 6,
        :short => "B.Phy.564"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik I",
        :credits => 6,
        :short => "B.Phy.571"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik II",
        :credits => 6,
        :short => "B.Phy.572"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik III",
        :credits => 6,
        :short => "B.Phy.573"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Festkörper- und Materialphysik IV",
        :credits => 6,
        :short => "B.Phy.574"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik I",
        :credits => 6,
        :short => "B.Phy.581"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik II",
        :credits => 6,
        :short => "B.Phy.582"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik III",
        :credits => 6,
        :short => "B.Phy.583"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der Kern- und Teilchenphysik IV",
        :credits => 6,
        :short => "B.Phy.584"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der modernen Physik I",
        :credits => 6,
        :short => "B.Phy.591"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der modernen Physik II",
        :credits => 6,
        :short => "B.Phy.592"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der modernen Physik III",
        :credits => 6,
        :short => "B.Phy.593"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save
      s1 = Studmodule.create :name => "Spezielle Themen der modernen Physik IV",
        :credits => 6,
        :short => "B.Phy.594"
      s1.categories << Category.find(:first, :conditions => "name = 'Spezielle Themen'")
      s1.save

      # Profilierungsbereich

      s1 = Studmodule.create :name => "Elektronikpraktikum für Naturwissenschaftler",
        :credits => 6,
        :short => "B.Phy.606"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Mikrobiologie",
        :credits => 10,
        :short => "B.Bio.118"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Biochemie",
        :credits => 10,
        :short => "B.Bio.112"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Interne Unternehmensrechnung",
        :credits => 6,
        :short => "B.Bwl.02"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Jahresabschluss",
        :credits => 6,
        :short => "B.OPH.07"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Produktion und Logistik",
        :credits => 6,
        :short => "B.Bwl.04"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Management der Informationssysteme",
        :credits => 6,
        :short => "B.Win.01"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Informationsverarbeitung in Dienstleistungsbetrieben",
        :credits => 6,
        :short => "B.Win.04"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Programmierung in C# (Grundlagen)",
        :credits => 6,
        :short => "B.Win.23"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Allgemeine und Anorganische Chemie für Physiker",
        :credits => 4,
        :short => "B.Che.9105"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Praktikum Allgemeine und Anorganische Chemie für Physiker",
        :credits => 8,
        :short => "B.Che.9106"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Organische und makromolekulare Chemie für Physiker",
        :credits => 3,
        :short => "B.Che.9108"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Chemisches Gleichgewicht für Physiker",
        :credits => 6,
        :short => "B.Che.1302.1"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Kinetik",
        :credits => 6,
        :short => "B.Che.2301"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Atombau und Chemische Bindung",
        :credits => 4,
        :short => "B.Che.1401"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save
      s1 = Studmodule.create :name => "Grundlagen der Geowissenschaften für Naturwissenschaftler",
        :credits => 12,
        :short => "B.Geo.402"
      s1.categories << Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
      s1.save

      # Schl&uuml;sselkompetenzen

      s1 = Studmodule.create :name => "Professionalisierungsseminar",
        :credits => 4,
        :short => "B.Phy.602"
      s1.categories << Category.find(:first, :conditions => "name = 'Schlüsselkompetenzen'")
      s1.save
      s1 = Studmodule.create :name => "Projektpraktikum",
        :credits => 6,
        :short => "B.Phy.604"
      s1.categories << Category.find(:first, :conditions => "name = 'Schlüsselkompetenzen'")
      s1.save
      s1 = Studmodule.create :name => "Computergestütztes wissenschaftliches Rechnen",
        :credits => 8,
        :short => "B.Phy.605"
      s1.categories << Category.find(:first, :conditions => "name = 'Schlüsselkompetenzen'")
      s1.save
  end

  def self.down
  end
end
