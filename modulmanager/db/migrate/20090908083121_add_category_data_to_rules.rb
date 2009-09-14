class AddCategoryDataToRules < ActiveRecord::Migration
  def self.up
    r = Rule.find(:first, :conditions => "name = 'Pflichtmodule'")
    r.category = Category.find(:first, :conditions => "name = 'Pflichtmodule'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'Grundkurs11'")
    r.category = Category.find(:first, :conditions => "name = 'Grundkurse'")
    r.save
    r = Rule.find(:first, :conditions => "name = 'Grundkurs12'")
    r.category = Category.find(:first, :conditions => "name = 'Grundkurse'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'Praktika11'")
    r.category = Category.find(:first, :conditions => "name = 'Praktika'")
    r.save
    r = Rule.find(:first, :conditions => "name = 'Praktika12'")
    r.category = Category.find(:first, :conditions => "name = 'Praktika'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'Mathematik11'")
    r.category = Category.find(:first, :conditions => "name = 'Mathematik'")
    r.save
    r = Rule.find(:first, :conditions => "name = 'Mathematik12'")
    r.category = Category.find(:first, :conditions => "name = 'Mathematik'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    r.category = Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'Spezialisierungspraktikum11'")
    r.category = Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
    r.save
    r = Rule.find(:first, :conditions => "name = 'Spezialisierungspraktikum12'")
    r.category = Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'Einführungen11'")
    r.category = Category.find(:first, :conditions => "name = 'Einführungen'")
    r.save
    r = Rule.find(:first, :conditions => "name = 'Einführungen12'")
    r.category = Category.find(:first, :conditions => "name = 'Einführungen'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'Spezielle Themen'")
    r.category = Category.find(:first, :conditions => "name = 'Spezielle Themen'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'Profilierungsbereich'")
    r.category = Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'MathNat'")
    r.category = Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'NichtPhysikalisch'")
    r.category = Category.find(:first, :conditions => "name = 'Profilierungsbereich'")
    r.save

    r = Rule.find(:first, :conditions => "name = 'Schlüsselkompetenzen'")
    r.category = Category.find(:first, :conditions => "name = 'Schlüsselkompetenzen'")
    r.save
  end

  def self.down
    Rule.all.each do |r|
      r.category = nil
    end
  end
end
