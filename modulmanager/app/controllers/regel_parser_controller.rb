class RegelParserController < ApplicationController

  def start
    if (
        Rule.all.length == 0 &&
        Category.all.length == 0 &&
        Focus.all.length == 0 &&
        Studmodule.all.length == 0 &&
        ModuleSelection.all.length == 0)
      read_module_files Array.new(["public/rules/modules2.yml"])
      read_group_files Array.new(["public/rules/groups2.yml"])
      read_focus_files Array.new(["public/rules/focus2.yml"])
      create_connections
      @modules = Studmodule.all
      @groups = Category.all
      @foci = Focus.all
      @rules = Rule.all
      @connections = Connection.all
      respond_to do |format|
        format.html
      end
    else
      redirect_to :action => "clear"
    end
  end

  def clear
    @connections = 0
    @rules = 0
    @groups = 0
    @foci = 0
    @modules = 0
    @sessions = 0
    Connection.all.each { |c| c.destroy; @connections += 1 }
    Rule.all.each { |r| r.destroy; @rules += 1 }
    Category.all.each { |c| c.destroy; @groups += 1 }
    Focus.all.each { |f| f.destroy; @foci += 1 }
    Studmodule.all.each { |m| m.destroy; @modules += 1 }
    ModuleSelection.all.each { |m| m.destroy; @sessions += 1 }
    SelectedModule.all.each { |sm| sm.destroy }
  end

private

  def read_focus_files files
    files.each do |filename|
      puts "#{filename}\n"
      file = File.open(filename)
      y = YAML::load(file)
      # foci = Array.new
      y.each do |f|
        build_focus(
          f["name"],
          f["description"],
          f["categories"]["Pflicht"],
          f["categories"]["Spezielle Themen"],
          f["categories"]["Profilierungsbereich"]
          ).save
      end
    end
  end

  def read_module_files files
    files.each do |filename|
      puts "#{filename}\n"
      file = File.open(filename)
      y = YAML::load(file)
      modules = Array.new
      y.each do |m|
        modules.push build_module m["name"], m["credits"], m["short"], m["description"]
      end
      modules.each do |m|
        m.save
      end
    end
  end

  def read_group_files files
    files.each do |filename|
      puts "#{filename}\n"
      file = File.open(filename)
      y = YAML::load(file)
      
      parent_groups = Array.new
      module_groups = Array.new

      y.each do |element|
        if element["sub-groups"] == nil
          module_groups.push element
          puts "#{element["name"]} zu module_groups hinzugefügt...\n"
        elsif element["modules"] == nil
          parent_groups.push element
          puts "#{element["name"]} zu parent_groups hinzugefügt...\n"
        end
      end

      module_groups.each { |mg| build_group_with_modules(mg["name"], mg["description"], mg["modules"]).save }
      parent_groups.each { |pg| build_group_with_sub_groups(pg["name"], pg["description"], pg["sub-groups"]).save }
    end
  end

  # 
  def read_rule_files
    # Öffnet die Regel-Datei und stellt einen Handler zur Verfügung, mit dem
    # auf den Inhalt der Datei zugegriffen werden kann.
    file = File.open("public/rules/rules1.yml")
    # In y wird der Inhalt der YAML-Datei als Hash abgelegt.
    y = YAML::load(file)
    # @rules wird als neues Datenfeld / Array initialisiert. Darin werden dann
    # alle aus der Datendatei erstellten Regeln abgelegt und dem View zur Ver-
    # fügung gestellt.
    @rules = Array.new
    # In der folgenden Schleife werden alle YAML-Datensätze durchlaufen, um aus
    # diesen dann Rails-Konforme Regeln für unsere Application zu erstellen.
    y.each do |r|
      # r erhält ein Array neu erstellter Regeln aus dem übergebenen Satz der
      # Regel-Datei aus der aufgerufenen Funktion zurück.
      r = extract_rules_from_sentence r["rule"]
      # Das Regel-Array wird in unsere @rules-Variable übertragen.
      r.each { |element|
        element.save
        @rules.push element
      }
    end
    # Rendern dem Aufruf entsprechend.
    respond_to do |format|
      format.xml { render :file => "regel_parser/rules.builder" }
    end
  end

  #============================================================================#
  #================================Regel-Teil==================================#
  #============================================================================#

  # Diese Funktion bekommt einen (mehr oder weniger) ausformulierten Satz über-
  # geben und extrahiert aus diesem dann alle wichtigen Informationen, um daraus
  # eine Regel zu erstellen und in der Datenbank abzulegen.
  def extract_rules_from_sentence sentence
    # Regelcontainer, der alle neu erstellten Regeln aufnimmt, um sie dann
    # am Ende der aufrufenden Funktion zu übergeben.
    rules = Array.new
    # Der Satz wird in seine einzelnen Wörter zerlegt.
    parts = sentence.upcase.split(" ")
    # Hilfsvariablen werden initialisiert. i ist hier der Zähler, der dafür
    # sorgt, dass alle Wörter durchlaufen werden. Gleichzeitig können so auch
    # nachfolgende Wörter ohne größeren Aufwand selektiert werden.
    # groups_started zeigt an, ab die Aufzählung der für die Regeln relevanten
    # Gruppen bereits begonnen hat.
    i = 0
    groups_started = false
    # Beginn der Schleife, in der alle im Satz vorkommenden Wörter durchlaufen
    # werden.
    while i < parts.length
      puts parts[i]
      # Hat die Aufzählung der Gruppen bereits begonne, kann man sich alle
      # weiteren Überprüfungen sparen und direkt mit dem abrufen der Gruppen
      # oder auch der Neuerstellung beginnen. Gruppen sollten eigentlich nur
      # in Ausnahmefällen neu erstellt werden, da diese ja bereits vorher ge-
      # parst wurden und somit bereits in der Datenbank vorhanden sind.
      if groups_started
        puts is_group(parts[i])
        unless is_group(parts[i])
          puts parts[i]
          unless is_grammar(parts[i])
            begin
              group = Group.find(:first, :conditions => "name = '#{parts[i]}'")
            rescue
              group = Group.new :name => parts[i]
            end
            rules.each { |r| r.groups.push group }
          end
        end
      # Hat die Aufzählung der Gruppen noch nicht begonnen so muss überprüft
      # werden, ob es sich beim aktuellen Wort um ein Schlüsselwort für min oder
      # max handelt.
      elsif is_min(parts[i]) ||
          is_max(parts[i])
        parts[i] = "min" if is_min(parts[i])
        parts[i] = "max" if is_max(parts[i])
        # Dem Regel-Array wird eine neue Regel mit den Wörtern min oder max
        # sowie den beiden daruffolgenden Wörtern gebildet. Dies sind die tat-
        # sächliche Größe der Menge, auf die sich die Bezugsgröße bezieht und
        # das Schlüsslewort, durch welches festgelegt ist, um welchen Regel-
        # typen es sich handelt. Danach kann der Wörter-Zähler gleich um 2
        # Stellen weitergeschaltet werden, da die nächsten beiden Wörter ja
        # hier bereits verarbeitet wurden.
        rules.push create_rule parts[i..i+2]
        i += 2
      # Beinhaltet das aktuelle Wort ein Schlüsselwort, welches anzeigt, dass
      # die Gruppenaufzählung beginnt, so wird der entsprechende Anzeiger auf
      # true gesetzt.
      elsif is_group_start(parts[i])
        groups_started = true
        puts "Groups started...\n"
      end
      # Letztendlich wird der Wörter-Zähler einen Schritt weitergesetzt, um das
      # durchlaufen der Schleife bis zum Ende zu gewährleisten.
      i += 1
    end
    # Am Ende der Funktion werden die erzeugten Regeln an die aufrufende
    # Funktion zurückgeliefert.
    return rules
  end

  # Überprüft, ob das übergebene Wort ein Schlüsselwort für "min" ist
  def is_min word
    word = chomp_brackets(word)
    if word == "MINDESTENS" ||
        word == "MIN" ||
        word == "WENIGSTENS" ||
        word == "MINIMUM" ||
        word == "MINIMAL"
      return true
    else
      return false
    end
  end

  # Überprüft, ob das übergebene Wort ein Schlüsselwort für "max" ist.
  def is_max word
    word = chomp_brackets(word)
    if word == "MAXIMAL" ||
        word == "MAX" ||
        word == "HOECHSTENS" ||
        word == "MAXIMUM"
      return true
    else
      return false
    end
  end

  # Überprüft, ob das übergebene Wort ein Schlüsselwort für eine CreditRule ist.
  def is_credit word
    word = chomp_brackets(word)
    if word == "CREDITS" ||
        word == "CREDIT" ||
        word == "CR" ||
        word == "C" ||
        word == "KREDITPUNKTE"
      return true
    else
      return false
    end
  end

  # Überprüft, ob das übergebene Wort ein Schlüsselwort für eine ModuleRule ist.
  def is_module word
    word = chomp_brackets(word)
    if word == "MODULES" ||
        word == "MODULE" ||
        word == "MOD" ||
        word == "M" ||
        word == "STUDIENMODUL"
      return true
    else
      return false
    end
  end

  # Überprüft, ob das übergebene Wort ein Schlüsselwort für den Beginn der
  # Gruppenaufzählung ist.
  def is_group_start word
    if word == "AUS" ||
        word == "VON" ||
        word == "IN"
      return true
    else
      return false
    end
  end

  # Überprüft, ob das übergebene Wort ein Schlüsselwort mit bezug zu den zu
  # übergebenden Gruppen ist.
  def is_group word
    if word == "GRUPPE" ||
        word == "GRUPPEN" ||
        word == "MENGE" ||
        word == "MENGEN" ||
        word == "MODULGRUPPE" ||
        word == "MODULGRUPPEN" ||
        word == "MODULMENGE" ||
        word == "MODULMENGEN"
      return true
    else
      return false
    end
  end

  # Entfernt eine Klammer am Enfang bzw. am Ende des übergebenen Wortes und
  # liefert das so entklammerte Wort zurück.
  def chomp_brackets word
    while word[word.length - 1] == 41
      word = word.chomp(")")
    end
    while word.reverse[word.length - 1] == 40
      word = word.reverse.chomp("(").reverse
    end
    return word
  end

  # Gibt die übergebene Regel auf der Konsole aus.
  def put_rule rule
    puts rule.type
    puts rule.relation
    puts rule.count
  end

  # Erstellt aus den übergebenen Wörtern eine neue Regel und liefert diese an
  # die aufrufende Funktion zurück.
  def create_rule words
    rule = nil
    if is_credit words[2]
      rule = CreditRule.new
    elsif is_module words[2]
      rule = ModuleRule.new
    end
    rule.count = words[1].to_i
    rule.relation = words[0]
    return rule
  end

  # Prüft, ob das übergebene Wort ein grammatikalisches Wort ist.
  def is_grammar word
    if word == "UND" ||
        word == "ODER" ||
        word == "SOWIE"
      return true
    else
      return false
    end
  end


  #============================================================================#
  #==============================Gruppen-Teil==================================#
  #============================================================================#

  def build_group_with_modules name, description, modules
    c = Category.new :name => name,
      :description => description

    modules = modules.split(",")
    modules.each do |m|
      m.strip!
      c.modules << Studmodule.find(:first, :conditions => "short = '#{m}'")
    end

    return c
  end

  def build_group_with_sub_groups name, description, sub_groups
    c = Category.new :name => name,
      :description => description

    sub_groups = sub_groups.split(",")
    sub_groups.each do |s|
      s.strip!
      puts "Suche #{s}...\n"
      c.sub_categories << Category.find(:first, :conditions => "name = '#{s}'")
    end
    
    return c
  end

  def put_group group
    puts group.name
    puts group.description
    group.modules.each do |m|
      puts m.name
    end
  end

  #============================================================================#
  #==============================Modul-Teil====================================#
  #============================================================================#

  def build_module name, credits, short, description
    s = Studmodule.new :name => name,
      :credits => credits,
      :short => short,
      :description => description
    return s
  end

  def build_focus name, description, pflicht, themen, profil
    f = Focus.new :name => name,
      :description => description
    if pflicht != nil
      pflicht = pflicht.split(",")
      pflicht.each do |p|
        p.strip!
        f.pflicht << Studmodule.find(:first, :conditions => "short = '#{p}'")
      end
    end
    if themen != nil
      themen = themen.split(",")
      themen.each do |t|
        t.strip!
        f.themen << Studmodule.find(:first, :conditions => "short = '#{t}'")
      end
    end
    if profil != nil
      profil = profil.split(",")
      profil.each do |p|
        p.strip!
        f.profil << Studmodule.find(:first, :conditions => "short = '#{p}'")
      end
    end
    return f
  end

  def rekursiv satz

    untersaetze = Array.new
    klammern = 0
    satz_zaehler = 0
    untersaetze[0] = Array.new
    satz.each_char do |buchstabe|
      if buchstabe == "("
        untersaetze[satz_zaehler].push(buchstabe) if klammern > 0
        klammern += 1
      elsif buchstabe == ")"
        if klammern == 1
          satz_zaehler += 1
          untersaetze[satz_zaehler] = Array.new
        end
        untersaetze[satz_zaehler].push(buchstabe) if klammern > 1
        klammern -= 1
      else
        untersaetze[satz_zaehler].push(buchstabe)
      end
    end

    if satz_zaehler > 1
      untersaetze.each { |u| rekursiv u.join }
    else
      build_rule untersaetze[0]
    end

  end

  def build_rule satz
    puts "Regel bauen (#{satz})\n"
  end

  def create_connections
    r1 = CreditRule.create :count => 54, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Grundkurs'")

    r2 = ModuleRule.create :count => 7, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Grundkurs'")

    grundkurs = AndConnection.create :name => "Grundkurs"
    grundkurs.child_rules << r1
    grundkurs.child_rules << r2

    r1 = CreditRule.create :count => 15, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Praktika'")

    r2 = ModuleRule.create :count => 2, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Praktika'")

    praktika = AndConnection.create :name => "Praktika"
    praktika.child_rules << r1
    praktika.child_rules << r2

    r1 = CreditRule.create :count => 33, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Mathematik'")

    r2 = ModuleRule.create :count => 4, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Mathematik'")

    mathematik = AndConnection.create :name => "Mathematik"
    mathematik.child_rules << r1
    mathematik.child_rules << r2

    pflichtmodule = AndConnection.create :name => "Pflichtmodule"
    pflichtmodule.child_connections << grundkurs
    pflichtmodule.child_connections << praktika
    pflichtmodule.child_connections << mathematik

    r1 = CreditRule.create :count => 6, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")

    r2 = ModuleRule.create :count => 1, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")

    spezpraktikum = AndConnection.create :name => "Spezialisierungspraktikum"
    spezpraktikum.child_rules << r1
    spezpraktikum.child_rules << r2

    r1 = CreditRule.create :count => 12, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Einführungen'")

    r2 = ModuleRule.create :count => 2, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Einführungen'")

    einfuehrungen = AndConnection.create :name => "Einführungen"
    einfuehrungen.child_rules << r1
    einfuehrungen.child_rules << r2

    r1 = CreditRule.create :count => 12, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")

    spezthemen = AndConnection.create :name => "Spezielle Themen"
    spezthemen.child_rules << r1

    r1 = CreditRule.create :count => 18, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")

    profilierung = AndConnection.create :name => "Profilierungsbereich"
    profilierung.child_rules << r1

    wahlpflicht = AndConnection.create :name => "Wahlpflichtbereich"
    wahlpflicht.child_connections << spezpraktikum
    wahlpflicht.child_connections << einfuehrungen
    wahlpflicht.child_connections << spezthemen
    wahlpflicht.child_connections << profilierung

    bachelor = AndConnection.create :name => "Bachelor"
    bachelor.child_connections << pflichtmodule
    bachelor.child_connections << wahlpflicht
  end

  public

  def test
    sentence = "((30 Credits aus A) und (2 Module aus B)) oder (5 Module aus C)"
    rekursiv sentence
  end

end
