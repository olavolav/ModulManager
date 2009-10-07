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
      file = File.open(filename)
      y = YAML::load(file)
      version = y[0]["version"]
      y.each do |f|
        if !f["version"]
          build_focus(
            f["name"],
            f["description"],
            f["categories"]["Pflicht"],
            f["categories"]["Spezielle Themen"],
            f["categories"]["Profilierungsbereich"],
            version
            ).save
        end
      end
    end
  end

  def read_module_files files
    files.each do |filename|
      file = File.open(filename)
      y = YAML::load(file)
      modules = Array.new
      version = y[0]["version"]
      y.each do |m|
        if !m["version"]
          m["parts"] = m["parts"].to_i
          m["parts"] = 1 if m["parts"] < 1
          modules.push build_module m["name"], m["credits"], m["short"], m["description"], m["parts"], version
        end
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
    files.each do |filename|
      file = File.open(filename)
      y = YAML::load(file)
      version = y[0]["version"]
      parent_groups = Array.new
      module_groups = Array.new

      y.each do |element|
        if element["sub-groups"] == nil
          module_groups.push element
        elsif element["modules"] == nil
          parent_groups.push element
        end
      end

      module_groups.each { |mg| build_group_with_modules(mg["name"], mg["description"], mg["modules"], version).save }
      parent_groups.each { |pg| build_group_with_sub_groups(pg["name"], pg["description"], pg["sub-groups"], version).save }
    end
  end

  def build_group_with_modules name, description, module_string, version
    c = Category.new :name => name,
      :description => description,
      :version => version,
      :modules => Studmodule::get_array_from_module_string(module_string)
    return c
  end

  def build_group_with_sub_groups name, description, categories_string, version
    c = Category.new :name => name,
      :description => description,
      :version => version,
      :sub_categories => Category::get_array_from_category_string(categories_string)
    return c
  end

  def build_module name, credits, short, description, parts, version = nil
    s = Studmodule.new :name => name,
      :credits => credits,
      :short => short,
      :description => description,
      :parts => parts,
      :version => version
    return s
  end

  def build_focus name, description, pflicht, themen, profil, version
    f = Focus.new :name => name,
      :description => description,
      :version => version
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
    group = Array.new
    modules = module_sentence.split(",")
    modules.each do |m|
      m.strip!
      group.push Studmodule.find(:first, :conditions => "short = '#{m}'")
    end
    return group
  end

  def create_min_focus_rule name, sub_groups

    sub_groups_array = Array.new
    sub_groups.each do |s|
      sg = Connection::create_and_connection s["name"], [
        Rule::create_min_credit_rule_for_focus(s["credits"], s["shorts"]),
        Rule::create_min_module_rule_for_focus(s["modules"], s["shorts"])
      ]
      sub_groups_array.push sg
    end
    return Connection::create_and_connection name, nil, sub_groups_array, 1
    
  end

  def create_min_standard_connection name, credits = nil, modules = nil
    child_rules = Array.new
    child_rules.push(Rule::create_min_credit_rule_for_standard(credits, name)) unless credits == nil
    child_rules.push(Rule::create_min_module_rule_for_standard(modules, name)) unless modules == nil
    r = Connection::create_and_connection(name, child_rules, nil, 0)
    return r
  end

  def create_connections

    grundkurs = create_min_standard_connection("Grundkurs", 54, 7)
    praktika = create_min_standard_connection("Praktika", 15, 2)
    mathematik = create_min_standard_connection("Mathematik", 33, 4)
    spezpraktikum = create_min_standard_connection("Spezialisierungs-Praktikum", 6, 1)
    einfuehrungen = create_min_standard_connection("Einführungen", 12, 2)
    spezthemen = create_min_standard_connection("Spezielle Themen", 12)
    profilierung = create_min_standard_connection("Profilierungsbereich", 18)

    pflichtmodule = Connection::create_and_connection "Pflichtmodule", nil, [grundkurs, praktika, mathematik]
    wahlpflicht = Connection::create_and_connection "Wahlpflichtbereich", nil, [spezpraktikum, einfuehrungen, spezthemen, profilierung]
    
    bachelor = Connection::create_and_connection "Bachelor", nil, [pflichtmodule, wahlpflicht], 0

    pflicht = {"name" => "Pflicht", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.503, B.Phy.403"}
    themen = {"name" => "Spezielle Themen", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.571, B.Phy.572, B.Phy.573, B.Phy.574"}
    profil = {"name" => "Profilierungsbereich", "credits" => 6, "modules" => 1, "shorts" => "B.Bwl.02, B.OPH.07, B.Bwl.04"}
    schwerpunkt = create_min_focus_rule("Nanostrukturphysik", [pflicht, themen, profil])

    pflicht = {"name" => "Pflicht", "credits" => 18, "modules" => 3, "shorts" => "B.Phy.510, B.Phy.511, B.Phy.404"}
    profil = {"name" => "Profilierungsbereich", "credits" => 6, "modules" => 1, "shorts" => "B.Win.01, B.Win.04, B.Win.23"}
    schwerpunkt = create_min_focus_rule("Physikinformatik", [pflicht, profil])

    pflicht = {"name" => "Pflicht", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.501, B.Phy.405"}
    themen = {"name" => "Spezielle Themen", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.551, B.Phy.552, B.Phy.553, B.Phy.554"}
    profil = {"name" => "Profilierungsbereich", "credits" => 6, "modules" => 1, "shorts" => "B.Phy.502, B.Phy.504"}
    schwerpunkt = create_min_focus_rule("Astro- und Geophysik", [pflicht, themen, profil])

    pflicht = {"name" => "Pflicht", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.502, B.Phy.406"}
    themen = {"name" => "Spezielle Themen", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.561, B.Phy.562, B.Phy.563, B.Phy.564"}
    profil = {"name" => "Profilierungsbereich", "credits" => 6, "modules" => 1, "shorts" => "B.Phy.501, B.Phy.503"}
    schwerpunkt = create_min_focus_rule("Biophysik und Physik komplexer Systeme", [pflicht, themen, profil])

    pflicht = {"name" => "Pflicht", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.503, B.Phy.407"}
    themen = {"name" => "Spezielle Themen", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.571, B.Phy.572, B.Phy.573, B.Phy.574"}
    profil = {"name" => "Profilierungbereich", "credits" => 6, "modules" => 1, "shorts" => "B.Phy.502, B.Phy.504"}
    schwerpunkt = create_min_focus_rule("Festkörper- und Materialphysik", [pflicht, themen, profil])

    pflicht = {"name" => "Pflicht", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.504, B.Phy.408"}
    themen = {"name" => "Spezielle Themen", "credits" => 12, "modules" => 2, "shorts" => "B.Phy.581, B.Phy.582, B.Phy.583, B.Phy.584"}
    profil = {"name" => "Profilierungsbereich", "credits" => 6, "modules" => 1, "shorts" => "B.Phy.501, B.Phy.503"}
    schwerpunkt = create_min_focus_rule("Kern- und Teilchenphysik", [pflicht, themen, profil])

  end

end
