class RegelParserController < ApplicationController

  def read_files
    file = File.open("public/rules/rules1.yml")
    y = YAML::load(file)
    @rules = Array.new
    i = 0
    y.each do |r|
      r = extract_rules_from_sentence r["rule"]
      r.each { |element| @rules.push element }
    end
    respond_to do |format|
      format.xml { render :file => "regel_parser/rules.builder" }
    end
  end

private

  def extract_rules_from_sentence sentence
    rules = Array.new
    parts = sentence.upcase.split(" ")
    i = 0
    groups_started = false
    while i < parts.length
      if groups_started
        unless is_group(parts[i])
          group = Group.new
          begin
            group = Group.find(:first, :conditions => "name = '#{parts[i]}'")
          rescue RecordNotFound
            group = Group.new :name => parts[i]
          else
            group = Group.new :name => parts[i]
          end
          rules.each { |r| r.groups.push group }
        end
      elsif parts[i] = is_min(parts[i]) ||
          parts[i] = is_max(parts[i])
        rules.push create_rule parts[i..i+2]
        i += 2
        
      end
      i += 1 if groups_started = is_group_start(parts[i])
      i += 1
    end

    return rules
  end

  def is_min word
    word = chomp_brackets(word)
    if word == "MINDESTENS" ||
        word == "MIN" ||
        word == "WENIGSTENS" ||
        word == "MINIMUM" ||
        word == "MINIMAL"
      return "min"
    else
      return nil
    end
  end

  def is_max word
    word = chomp_brackets(word)
    if word == "MAXIMAL" ||
        word == "MAX" ||
        word == "HOECHSTENS" ||
        word == "MAXIMUM"
      return "max"
    else
      return nil
    end
  end

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

  def is_group_start word
    if word == "AUS" ||
        word == "VON" ||
        word == "IN"
      return true
    else
      return false
    end
  end

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

  def chomp_brackets word
    word = word.chomp(")")
    word = word.reverse.chomp("(").reverse
    return word
  end

  def put_rule rule
    puts rule.type
    puts rule.relation
    puts rule.count
  end

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

end
