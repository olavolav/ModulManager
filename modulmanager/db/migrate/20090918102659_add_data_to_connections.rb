class AddDataToConnections < ActiveRecord::Migration
  def self.up

    r1 = CreditRule.create :count => 54, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Grundkurs'")

    r2 = ModuleRule.create :count => 7, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Grundkurs'")

    grundkurs = AndConnection.create
    grundkurs.child_rules << r1
    grundkurs.child_rules << r2

    r1 = CreditRule.create :count => 15, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Praktika'")

    r2 = ModuleRule.create :count => 2, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Praktika'")

    praktika = AndConnection.create
    praktika.child_rules << r1
    praktika.child_rules << r2

    r1 = CreditRule.create :count => 33, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Mathematik'")

    r2 = ModuleRule.create :count => 4, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Mathematik'")

    mathematik = AndConnection.create
    mathematik.child_rules << r1
    mathematik.child_rules << r2

    pflichtmodule = AndConnection.create
    pflichtmodule.child_connections << grundkurs
    pflichtmodule.child_connections << praktika
    pflichtmodule.child_connections << mathematik

    r1 = CreditRule.create :count => 6, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")

    r2 = ModuleRule.create :count => 1, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungspraktikum'")

    spezpraktikum = AndConnection.create
    spezpraktikum.child_rules << r1
    spezpraktikum.child_rules << r2

    r1 = CreditRule.create :count => 12, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Einführungen'")

    r2 = ModuleRule.create :count => 2, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Einführungen'")

    einfuehrungen = AndConnection.create
    einfuehrungen.child_rules << r1
    einfuehrungen.child_rules << r2

    r1 = CreditRule.create :count => 12, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Spezielle Themen'")

    spezthemen = AndConnection.create
    spezthemen.child_rules << r1

    r1 = CreditRule.create :count => 18, :relation => "min",
      :category => Category.find(:first, :conditions => "name = 'Profilierungsbereich'")

    profilierung = AndConnection.create
    profilierung.child_rules << r1

    wahlpflicht = AndConnection.create
    wahlpflicht.child_connections << spezpraktikum
    wahlpflicht.child_connections << einfuehrungen
    wahlpflicht.child_connections << spezthemen
    wahlpflicht.child_connections << profilierung

    bachelor = AndConnection.create
    bachelor.child_connections << pflichtmodule
    bachelor.child_connections << wahlpflicht
  end

  def self.down
    Rule.all.each { |r| r.destroy }
    Connection.all.each { |c| c.destroy }
  end
end
