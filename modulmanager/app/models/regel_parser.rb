# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class RegelParser
  
  def init
    # bla
  end
  
  def self.clear
    puts "clearing..."
    connections = 0
    rules = 0
    groups = 0
    foci = 0
    modules = 0
    sessions = 0
    versions = 0
    
    Connection.all.each { |c| c.destroy; connections += 1 }
    Rule.all.each { |r| r.destroy; rules += 1 }
    Category.all.each { |c| c.destroy; groups += 1 }
    Focus.all.each { |f| f.destroy; foci += 1 }
    Studmodule.all.each { |m| m.destroy; modules += 1 }
    ModuleSelection.all.each { |m| m.destroy; sessions += 1 }
    SelectedModule.all.each { |sm| sm.destroy }
    Version.all.each { |v| v.destroy; versions += 1 }
    Semester.all.each { |s| s.destroy }
    # Connection.all.each { |c| c.destroy }
    # Rule.all.each { |r| r.destroy }
    # Category.all.each { |c| c.destroy }
    # Focus.all.each { |f| f.destroy }
    # Studmodule.all.each { |m| m.destroy }
    # ModuleSelection.all.each { |m| m.destroy }
    # SelectedModule.all.each { |sm| sm.destroy }
    # Version.all.each { |v| v.destroy }
    # Semester.all.each { |s| s.destroy }
    
    return [connections, rules, groups, foci, modules, sessions, versions]
  end
  
  def self.any_rules_currently_in_database?
    return !(Rule.all.length == 0 &&
      Category.all.length == 0 &&
      Focus.all.length == 0 &&
      Studmodule.all.length == 0 &&
      ModuleSelection.all.length == 0)
  end
  
  
  def self.check_syntax(dir_name="config/basedata/po_ss_2009")
    puts "===================================="
    puts "Checking directory #{dir_name}"
    puts "------------------------------------"
    puts "beschreibung.yml"
    y = extract_yaml("#{dir_name}/beschreibung.yml")
    y.each do |key, value|
      puts "wrong syntax in 'beschreibung.yml' -> #{key} : #{value}" unless valid_key_word? key
    end

    puts "------------------------------------"
    puts "gruppen.yml"
    y = extract_yaml("#{dir_name}/gruppen.yml")
    y.each do |element|
      element.each do |key, value|
        puts "wrong syntax in 'gruppen.yml' -> #{key} : #{value}" unless valid_key_word? key
      end
    end

    puts "------------------------------------"
    puts "module.yml"
    y = extract_yaml("#{dir_name}/module.yml")
    y.each do |element|
      element.each do |key, value|
        puts "wrong syntax in 'module.yml' -> #{key} : #{value}" unless valid_key_word? key
      end
    end

    puts "------------------------------------"
    puts "schwerpunkte.yml"
    y = extract_yaml("#{dir_name}/schwerpunkte.yml")
    y.each do |element|
      element.each do |key, value|
        puts "wrong syntax in 'schwerpunkte.yml' -> #{key} : #{value}" unless valid_key_word? key
      end
    end

    puts "------------------------------------"
    puts "vorauswahl.yml"
    y = extract_yaml("#{dir_name}/vorauswahl.yml")
    y.each do |element|
      element.each do |key, value|
        puts "wrong syntax in 'vorauswahl.yml' -> #{key} : #{value}" unless valid_key_word? key
      end
    end
  end
  
  
  def self.initialize_po(dir_name="config/basedata/po_ss_2009")
    puts "==========================================="
    puts "Initializing PO"
    puts "-------------------------------------------"
    puts "reading beschreibung.yml"
    version = read_description_file "#{dir_name}/beschreibung.yml"
    puts "-------------------------------------------"
    puts "reading module.yml"
    read_module_file("#{dir_name}/module.yml", version)
    puts "-------------------------------------------"
    puts "reading gruppen.yml"
    read_group_file("#{dir_name}/gruppen.yml", version)
    puts "-------------------------------------------"
    puts "reading schwerpunkte.yml"
    read_focus_file("#{dir_name}/schwerpunkte.yml", version)
    puts "-------------------------------------------"
    puts "returning version.id = #{version.id}"
    return version
  end
  
  private
  
  def self.valid_key_word? word
    return REGEL_PARSER_KEY_WORDS.include? word
  end

  
  def self.read_description_file filename
    y = extract_yaml(filename)
    version = Version.create :name => y["name"],
      :short => y["kurz"],
      :description => y["beschreibung"],
      :date => y["datum"],
      :path => y["pfad"]

    return version
  end

  def self.read_focus_file filename, version
    y = extract_yaml(filename)
    y.each do |f|

      focus = Focus.create :name => f["name"],
        :description => f["beschreibung"],
        :version => version
      
      kategorien = Array.new

      f["kategorien"].each do |k|
        group = Category.create :name => k["name"],
          :credits => k["credits"],
          :count => k["anzahl"],
          :modules => Studmodule::get_array_from_module_string(k["module"], version),
          :modus => k["modus"]
        focus.categories << group
        kategorie = {
          "name" => k["name"],
          "credits" => k["credits"],
          "modules" => k["anzahl"],
          "shorts" => k["module"]
        }
        kategorien.push kategorie
      end
      create_min_focus_rule(focus["name"], focus["beschreibung"], kategorien, version)
    end
  end

  def self.read_module_file filename, version
    y = extract_yaml(filename)
    
    free_modules = Array.new
    limited_modules = Array.new
    parent_modules = Array.new
    late_modules = Array.new

    y.each do |m|
      if m["zulassung"]     != nil && m["sub-module"] != nil
        late_modules.push m
      elsif m["zulassung"]  != nil && m["sub-module"] == nil
        limited_modules.push m
      elsif m["zulassung"]  == nil && m["sub-module"] != nil
        parent_modules.push m
      elsif m["zulassung"]  == nil && m["sub-module"] == nil
        free_modules.push m
      else
      end

    end

    while(late_modules.length > 0 || limited_modules.length > 0 || parent_modules.length > 0 || free_modules.length > 0)
      puts "loop..."
      puts "late_modules -> #{late_modules.length}"
      puts "limited_modules -> #{limited_modules.length}"
      puts "parent_modules -> #{parent_modules.length}"
      puts "free_modules -> #{free_modules.length}"

      free_modules.each do |data|
        m = Studmodule.create :name => data["name"],
          :credits                  => data["credits"],
          :short                    => data["id"],
          :description              => data["beschreibung"],
          :version                  => version,
          :univzid                  => data["univzid"]

        unless data["note"] == nil
          data["note"].downcase == "nein" ? m.has_grade = false : m.has_grade = true
        end
        m.subname = data["sub-name"] unless data["sub-name"] == nil
        m.save
        free_modules.delete data
      end

      limited_modules.each do |data|
        m = Studmodule.new :name  => data["name"],
          :credits                => data["credits"],
          :short                  => data["id"],
          :description            => data["beschreibung"],
          :version                => version,
          :univzid                => data["univzid"]

        unless data["note"] == nil
          data["note"].downcase == "nein" ? m.has_grade = false : m.has_grade = true
        end
        m.subname = data["sub-name"] unless data["sub-name"] == nil
        if create_limited_connection data["zulassung"], m
          m.save
          limited_modules.delete(data) 
        end
      end

      parent_modules.each do |data|
        fault = false
        children = data["sub-module"].split(",")
        children.each do |child|
          child.strip!
          fault = true if Studmodule.find(:first, :conditions => "short = '#{child}' AND version_id = #{version.id}") == nil
        end

        unless fault
          m = Studmodule.new :name  => data["name"],
            :credits                => data["credits"],
            :short                  => data["id"],
            :description            => data["beschreibung"],
            :children               => Studmodule::get_array_from_module_string(data["sub-module"], version),
            :version                => version,
            :subname                => data["sub-name"],
            :univzid                => data["univzid"]

          unless data["note"] == nil
            data["note"].downcase == "nein" ? m.has_grade = false : m.has_grade = true
          else
            m.has_grade = true;
          end
          m.save
          parent_modules.delete data
        end
      end

      late_modules.each do |data|
        fault = false
        m = Studmodule.new :name  => data["name"],
          :credits                => data["credits"],
          :short                  => data["id"],
          :description            => data["beschreibung"],
          :version                => version,
          :univzid                => data["univzid"]

        unless data["note"] == nil
          data["note"].downcase == "nein" ? m.has_grade = false : m.has_grade = true
        end
        m.subname = data["sub-name"] unless data["sub-name"] == nil
        unless data["sub-module"] == nil
          children = data["sub-module"].split(",")
          children.each do |child|
            child.strip!
            fault = true if Studmodule.find(:first, :conditions => "short = '#{child}' AND version_id = #{version.id}") == nil
          end
          m.children = Studmodule::get_array_from_module_string(data["sub-module"], version) unless fault
        end
        if create_limited_connection(data["zulassung"], m) && fault != true
          late_modules.delete data
          m.save
        end
      end

    end
  end

  def self.create_limited_connection zulassung, owner
    fault = false
    and_connections = Array.new
    zulassung.each do |z|
      rules = Array.new
      modules = z.split(",")
      modules.each do |mod|
        mod.strip!
        fault = true if Studmodule.find(:first, :conditions => "short = '#{mod}' AND version_id = #{owner.version.id}") == nil
      end

      modules = Studmodule::get_array_from_module_string(z, owner.version)

      modules.each { |mod| rules.push PermissionRule.new :condition => mod }

      and_connections.push AndConnection.new :child_rules => rules
    end
    or_connection = OrConnection.new :child_connections => and_connections, :owner => owner

    unless fault
      or_connection.save
      return true
    else
      puts "Fault while creating limited connection (regel_parser_controller:384)"
      return false
    end
  end

  def self.create_limited_module m, version
    children = Studmodule::get_array_from_module_string(m["sub-module"]) unless m["sub-module"] == nil
    ready_module = Studmodule.create :name => m["name"],
      :credits => m["credits"],
      :short => m["id"],
      :description => m["beschreibung"],
      :version => version

    ready_module.subname = m["sub-name"] unless m["sub-name"] == nil

    ready_module.children = children unless children == nil
    ready_module.save
    and_connections = Array.new
    m["zulassung"].each do |z|
      rules = Array.new
      modules = Studmodule::get_array_from_module_string(z)
      modules.each {|mm| rules.push PermissionRule.create :condition => mm}
      and_connections.push AndConnection.create :child_rules => rules
    end unless m["zulassung"] == nil
    OrConnection.create :child_connections => and_connections, :owner => ready_module
    return ready_module
  end

  def self.read_group_file filename, version
    dummie_counter = 1

    yaml_data = extract_yaml(filename)

    i = 0
    yaml_data.each do |data|
      data["position"] = i
      i += 1
    end

    groups = Array.new
    groups[0] = yaml_data

    i = 0
    last_level = false

    until last_level
      groups[i+1] = Array.new
      level_up = Array.new
      groups[i].each do |group|
        if group["untergruppen"] == nil
          level_up.push group["name"]
        elsif group["module"] == nil
          subgroups = group["untergruppen"].split(",")
          subgroups.each {|s| s.strip!}
          level_up = level_up.concat subgroups
        end
      end
      level_up.uniq!
      level_up.each do |groupname|
        groups[i].each do |group|
          if group["name"] == groupname
            groups[i+1].push group
          end
        end
      end
      if groups[i+1].length > 0
        groups[i+1].each {|group| groups[i].delete group}
      end
      last_level = true
      groups[i].each { |group| last_level = false if group["module"] == nil }
      i += 1
    end

    i = groups.length - 1

    until i == -1

      groups[i].each do |group|

        group["sichtbar"] == "nein" ? visible = false : visible = true

        c = Category.new
        c.name = group["name"]
        c.description = group["beschreibung"]
        c.version = version
        c.visible = visible
        c.position = group["position"]

        c.unique_name = group["auswahl-name"]

        c.modus = group["modus"]
          
        if group["untergruppen"] == nil
          #          c.modus = group["modus"]
          modules = Studmodule::get_array_from_module_string group["module"], version
          # (Test OS) logger.warn "get_array_from_module_string: "+(group["module"]).to_s
          
          c.modules = modules
          unless group["dummies"] == nil
            group["dummies"].times do
              dummie = Studmodule.create :name => "(Sonstiges Modul)",
                :short => "custom##{dummie_counter}",
                :parts => 1,
                :version => version
              c.modules << dummie
              dummie_counter += 1
            end
          end
          unless group["note-streichen"] == nil
            c.grade_remove = group["note-streichen"]
          end
          if group["überschneidung"] == "mehrfach"
            c.exclusive = 1
          end
          c.save
          create_min_standard_connection(group["name"], group["beschreibung"], group["credits"], group["anzahl"], version, group["position"])
        elsif group["module"] == nil
          c.sub_categories = Category::get_array_from_category_string group["untergruppen"], version
          Connection::create_and_connection(
            group["name"],
            group["beschreibung"],
            nil,
            Connection::get_connection_array_from_category_string(group["untergruppen"], version),
            0,
            version,
            group["position"]
          )
          c.save
        end
      end

      i -= 1
    end

  end

  def self.extract_yaml filename
    file = File.open(filename)
    y = YAML::load(file)
    return y
  end

  def self.create_min_focus_rule name, description, sub_groups, version = nil
    sub_groups_array = Array.new
    sub_groups.each do |s|
      sg = Connection::create_and_connection s["name"], description, [
        Rule::create_min_credit_rule_for_focus(s["credits"], s["shorts"], version),
        Rule::create_min_module_rule_for_focus(s["modules"], s["shorts"], version)
      ]
      sub_groups_array.push sg
    end
    return Connection::create_and_connection(
      name,
      description,
      nil,
      sub_groups_array,
      1,
      version
    )
    
  end

  def self.create_min_standard_connection name, description, credits = nil, modules = nil, version = nil, position = nil
    child_rules = Array.new
    child_rules.push(Rule::create_min_credit_rule_for_standard(credits, name, version)) unless credits == nil
    child_rules.push(Rule::create_min_module_rule_for_standard(modules, name, version)) unless modules == nil
    r = Connection::create_and_connection(name, description, child_rules, nil, 0, version, position)
    return r
  end
  
end
