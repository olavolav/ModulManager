class RegelParserController < ApplicationController

  def start
    puts "start aufgerufen..."
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
    puts "clear aufgerufen..."
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
    puts "read_focus_files aufgerufen..."
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
    puts "read_module_files aufgerufen..."
    files.each do |filename|
      file = File.open(filename)
      y = YAML::load(file)
      modules = Array.new
      y.each do |m|
        m["parts"] = m["parts"].to_i
        m["parts"] = 1 if m["parts"] < 1
        modules.push build_module m["name"], m["credits"], m["short"], m["description"], m["parts"]
      end
      18.times do |i|
        modules.push build_module "Eigenes Modul", nil, "custom#{(i+1)}", nil, 1
      end
      modules.each do |m|
        m.save
      end
    end
  end

  def read_group_files files
    puts "read_group_files aufgerufen..."
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

  #============================================================================#
  #==============================Gruppen-Teil==================================#
  #============================================================================#

  def build_group_with_modules name, description, modules
    puts "build_group_with_modules aufgerufen..."
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
    puts "build_group_with_sub_groups aufgerufen..."
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

  #============================================================================#
  #==============================Modul-Teil====================================#
  #============================================================================#

  def build_module name, credits, short, description, parts = 1
    puts "build_module aufgerufen..."
    s = Studmodule.new :name => name,
      :credits => credits,
      :short => short,
      :description => description,
      :parts => parts
    return s
  end

  def build_focus name, description, pflicht, themen, profil
    puts "build_focus aufgerufen..."
    f = Focus.new :name => name,
      :description => description
    if pflicht != nil
      f.pflicht = build_focus_group pflicht
    end
    if themen != nil
      f.themen = build_focus_group themen
    end
    if profil != nil
      f.profil = build_focus_group profil
    end
    return f
  end

  def build_focus_group module_sentence
    puts "build_focus_group aufgerufen..."
    group = Array.new
    modules = module_sentence.split(",")
    modules.each do |m|
      m.strip!
      group.push Studmodule.find(:first, :conditions => "short = '#{m}'")
    end
    return group
  end

  def create_and_connection name, child_rules = nil, child_connections = nil, focus = nil
    c = AndConnection.create :name => name, :focus => focus
    if child_rules != nil
      c.child_rules = child_rules
    elsif child_connections != nil
      c.child_connections = child_connections
    end
    return c
  end

  def create_connections
    puts "create_connections aufgerufen..."

    r1 = CreditRule.create :count => 54, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Grundkurs'")
    r2 = ModuleRule.create :count => 7, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Grundkurs'")
    grundkurs = create_and_connection "Grundkurs", [r1, r2]

    r1 = CreditRule.create :count => 15, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Praktika'")
    r2 = ModuleRule.create :count => 2, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Praktika'")
    praktika = create_and_connection "Praktika", [r1, r2]

    r1 = CreditRule.create :count => 33, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Mathematik'")
    r2 = ModuleRule.create :count => 4, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Mathematik'")
    mathematik = create_and_connection "Mathematik", [r1, r2]
    pflichtmodule = create_and_connection "Pflichtmodule", nil, [grundkurs, praktika, mathematik]


    r1 = CreditRule.create :count => 6, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungs-Praktikum'")
    r2 = ModuleRule.create :count => 1, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungs-Praktikum'")
    spezpraktikum = create_and_connection "Spezialisierungs-Praktikum", [r1, r2]

    r1 = CreditRule.create :count => 12, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Einführungen'")
    r2 = ModuleRule.create :count => 2, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Einführungen'")
    einfuehrungen = create_and_connection "Einführungen", [r1, r2]

    r1 = CreditRule.create :count => 12, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")
    spezthemen = create_and_connection "Spezielle Themen", [r1]

    r1 = CreditRule.create :count => 18, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
    profilierung = create_and_connection "Profilierungsbereich", [r1]
    wahlpflicht = create_and_connection "Wahlpflichtbereich", nil, [spezpraktikum, einfuehrungen, spezthemen, profilierung]
    bachelor = create_and_connection "Bachelor", nil, [pflichtmodule, wahlpflicht], 0

    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.503'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.403'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.503'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.403'")

    pflicht = AndConnection.create :name => "Pflicht"
    pflicht.child_rules << r1
    pflicht.child_rules << r2

    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.571'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.572'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.573'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.574'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.571'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.572'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.573'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.574'")

    themen = AndConnection.create :name => "Spezielle Themen"
    themen.child_rules << r1
    themen.child_rules << r2

    r1 = ModuleRule.create :count => 1, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Bwl.02'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.OPH.07'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Bwl.04'")

    r2 = CreditRule.create :count => 6, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Bwl.02'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.OPH.07'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Bwl.04'")

    profil = AndConnection.create :name => "Profilierungsbereich"
    profil.child_rules << r1
    profil.child_rules << r2
    
    schwerpunkt = AndConnection.create :name => "Nanostrukturphysik", :focus => 1
    schwerpunkt.child_connections << pflicht
    schwerpunkt.child_connections << themen
    schwerpunkt.child_connections << profil

    r1 = ModuleRule.create :count => 3, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.510'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.511'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.404'")

    r2 = CreditRule.create :count => 18, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.510'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.511'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.404'")

    pflicht = AndConnection.create :name => "Pflicht"
    pflicht.child_rules << r1
    pflicht.child_rules << r2

    r1 = ModuleRule.create :count => 1, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Win.01'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Win.04'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Win.23'")

    r2 = CreditRule.create :count => 6, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Win.01'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Win.04'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Win.23'")

    profil = AndConnection.create :name => "Profilierungsbereich"
    profil.child_rules << r1
    profil.child_rules << r2

    schwerpunkt = AndConnection.create :name => "Physikinformatik", :focus => 1
    schwerpunkt.child_connections << pflicht
    schwerpunkt.child_connections << themen
    schwerpunkt.child_connections << profil


    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.501'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.405'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.501'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.405'")

    pflicht = AndConnection.create :name => "Pflicht"
    pflicht.child_rules << r1
    pflicht.child_rules << r2

    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.551'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.552'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.553'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.554'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.551'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.552'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.553'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.554'")

    themen = AndConnection.create :name => "Spezielle Themen"
    themen.child_rules << r1
    themen.child_rules << r2

    r1 = ModuleRule.create :count => 1, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.502'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.504'")

    r2 = CreditRule.create :count => 6, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.502'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.504'")

    profil = AndConnection.create :name => "Profilierungsbereich"
    profil.child_rules << r1
    profil.child_rules << r2

    schwerpunkt = AndConnection.create :name => "Astro- und Geophysik", :focus => 1
    schwerpunkt.child_connections << pflicht
    schwerpunkt.child_connections << themen
    schwerpunkt.child_connections << profil


    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.502'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.406'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.502'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.406'")

    pflicht = AndConnection.create :name => "Pflicht"
    pflicht.child_rules << r1
    pflicht.child_rules << r2

    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.561'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.562'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.563'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.564'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.561'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.562'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.563'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.564'")

    themen = AndConnection.create :name => "Spezielle Themen"
    themen.child_rules << r1
    themen.child_rules << r2

    r1 = ModuleRule.create :count => 1, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.501'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.503'")

    r2 = CreditRule.create :count => 6, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.501'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.503'")

    profil = AndConnection.create :name => "Profilierungsbereich"
    profil.child_rules << r1
    profil.child_rules << r2

    schwerpunkt = AndConnection.create :name => "Biophysik und Physik komplexer Systeme", :focus => 1
    schwerpunkt.child_connections << pflicht
    schwerpunkt.child_connections << themen
    schwerpunkt.child_connections << profil


    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.503'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.407'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.503'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.407'")

    pflicht = AndConnection.create :name => "Pflicht"
    pflicht.child_rules << r1
    pflicht.child_rules << r2

    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.571'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.572'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.573'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.574'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.571'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.572'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.573'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.574'")

    themen = AndConnection.create :name => "Spezielle Themen"
    themen.child_rules << r1
    themen.child_rules << r2

    r1 = ModuleRule.create :count => 1, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.502'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.504'")

    r2 = CreditRule.create :count => 6, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.502'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.504'")

    profil = AndConnection.create :name => "Profilierungsbereich"
    profil.child_rules << r1
    profil.child_rules << r2

    schwerpunkt = AndConnection.create :name => "Festkörper- und Materialphysik", :focus => 1
    schwerpunkt.child_connections << pflicht
    schwerpunkt.child_connections << themen
    schwerpunkt.child_connections << profil


    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.504'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.408'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.504'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.408'")

    pflicht = AndConnection.create :name => "Pflicht"
    pflicht.child_rules << r1
    pflicht.child_rules << r2

    r1 = ModuleRule.create :count => 2, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.581'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.582'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.583'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.584'")

    r2 = CreditRule.create :count => 12, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.581'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.582'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.583'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.584'")

    themen = AndConnection.create :name => "Spezielle Themen"
    themen.child_rules << r1
    themen.child_rules << r2

    r1 = ModuleRule.create :count => 1, :relation => "min"
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.501'")
    r1.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.503'")

    r2 = CreditRule.create :count => 6, :relation => "min"
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.501'")
    r2.modules << Studmodule.find(:first, :conditions => "short = 'B.Phy.503'")

    profil = AndConnection.create :name => "Profilierungsbereich"
    profil.child_rules << r1
    profil.child_rules << r2

    schwerpunkt = AndConnection.create :name => "Kern- und Teilchenphysik", :focus => 1
    schwerpunkt.child_connections << pflicht
    schwerpunkt.child_connections << themen
    schwerpunkt.child_connections << profil

  end

end
