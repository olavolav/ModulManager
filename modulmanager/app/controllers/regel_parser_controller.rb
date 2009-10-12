class RegelParserController < ApplicationController

  def start
    if (
        Rule.all.length == 0 &&
          Category.all.length == 0 &&
          Focus.all.length == 0 &&
          Studmodule.all.length == 0 &&
          ModuleSelection.all.length == 0)

      version = nil

      po_entries = Dir.entries("config/basedata/")

      po_entries.delete(".")
      po_entries.delete("..")
      po_entries.delete(".svn")
      po_entries.delete("README.txt")

      po_entries.each do |entry|
        version = initialize_po "config/basedata/#{entry}"
      end

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
    @versions = 0
    Connection.all.each { |c| c.destroy; @connections += 1 }
    Rule.all.each { |r| r.destroy; @rules += 1 }
    Category.all.each { |c| c.destroy; @groups += 1 }
    Focus.all.each { |f| f.destroy; @foci += 1 }
    Studmodule.all.each { |m| m.destroy; @modules += 1 }
    ModuleSelection.all.each { |m| m.destroy; @sessions += 1 }
    SelectedModule.all.each { |sm| sm.destroy }
    Version.all.each { |v| v.destroy; @versions += 1 }
  end

  private

  def initialize_po dir_name

    version = read_description_file "#{dir_name}/beschreibung.yml"
    read_module_file "#{dir_name}/module.yml", version
    read_group_file("#{dir_name}/gruppen.yml", version)
    read_focus_file("#{dir_name}/schwerpunkte.yml", version)

    return version
  end

  def read_description_file filename

    file = File.open(filename)
    y = YAML::load(file)
    
    version = Version.create :name => y["name"],
      :short => y["kurz"],
      :description => y["beschreibung"],
      :date => y["datum"]

    return version

  end

  def read_focus_file filename, version
    file = File.open(filename)
    y = YAML::load(file)

    y.each do |f|

      focus = Focus.create :name => f["name"],
        :description => f["beschreibung"],
        :version => version
      
      kategorien = Array.new

      f["kategorien"].each do |k|
        group = Group.create :name => k["name"],
          :credits => k["credits"],
          :count => k["anzahl"],
          :modules => Studmodule::get_array_from_module_string(k["module"])
        focus.groups << group

        kategorie = {
          "name" => k["name"],
          "credits" => k["credits"],
          "modules" => k["anzahl"],
          "shorts" => k["module"]
        }

        kategorien.push kategorie

      end
      
      schwerpunkt = create_min_focus_rule(focus["name"], kategorien, version)

    end

  end

  def read_module_file filename, version
    file = File.open(filename)
    y = YAML::load(file)
    y.each do |m|
      m["parts"] = m["parts"].to_i
      m["parts"] = 1 if m["parts"] < 1
      Studmodule.create :name => m["name"],
        :credits => m["credits"],
        :short => m["short"],
        :description => m["description"],
        :parts => m["parts"],
        :version => version

    end
    18.times do |i|
      Studmodule.create :name => "Eigenes Modul",
        :short => "custom#{(i+1)}",
        :parts => 1
    end
  end

  def read_group_file filename, version
    file = File.open(filename)
    y = YAML::load(file)
    parent_groups = Array.new
    module_groups = Array.new
    y.each do |element|
      if element["untergruppen"] == nil
        module_groups.push element
      elsif element["module"] == nil
        parent_groups.push element
      end
    end
    module_groups.each do |mg|
      Category.create :name => mg["name"],
        :description => mg["beschreibung"],
        :version => version,
        :modules => Studmodule::get_array_from_module_string(mg["module"]),
        :modus => mg["modus"]
      create_min_standard_connection(mg["name"], mg["credits"], mg["anzahl"], version)
    end
    parent_groups.each do |pg|
      Category.create :name => pg["name"],
        :description => pg["beschreibung"],
        :version => version,
        :sub_categories => Category::get_array_from_category_string(pg["untergruppen"]),
        :modus => pg["modus"]
      Connection::create_and_connection(
        pg["name"],
        nil,
        Connection::get_connection_array_from_category_string(pg["untergruppen"]),
        0,
        version
      )
    end
  end

  def create_min_focus_rule name, sub_groups, version = nil

    sub_groups_array = Array.new
    sub_groups.each do |s|
      sg = Connection::create_and_connection s["name"], [
        Rule::create_min_credit_rule_for_focus(s["credits"], s["shorts"]),
        Rule::create_min_module_rule_for_focus(s["modules"], s["shorts"])
      ]
      sub_groups_array.push sg
    end
    return Connection::create_and_connection(
      name,
      nil,
      sub_groups_array,
      1,
      version
    )
    
  end

  def create_min_standard_connection name, credits = nil, modules = nil, version = nil
    child_rules = Array.new
    child_rules.push(Rule::create_min_credit_rule_for_standard(credits, name)) unless credits == nil
    child_rules.push(Rule::create_min_module_rule_for_standard(modules, name)) unless modules == nil
    r = Connection::create_and_connection(name, child_rules, nil, 0, version)
    return r
  end

end
