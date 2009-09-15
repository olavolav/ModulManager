class RegelParserController < ApplicationController

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

  def read_group_files
    groups = Array.new
    file = File.open("public/rules/Groups1.yml")
    y = YAML::load(file)
    y.each do |element|
      groups.push build_group element["name"], element["description"], element["modules"]
    end
    groups.each do |g|
      g.save
    end
  end

private

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

  def build_group name, description, modules
    g = Group.new :name => name.upcase,
      :description => description

    modules.each do |m|
      begin
        g.modules << Studmodule.find(:first, :conditions => "short = '#{m}'")
      rescue ActiveRecord::RecordNotFound
        puts "Record not found...\n"
      rescue ActiveRecord::AssociationTypeMismatch
        puts "Type mismatch...\n"
      end
    end

    return g
  end

  def put_group group
    puts group.name
    puts group.description
    group.modules.each do |m|
      puts m.name
    end
  end

end
