class FillGroups < ActiveRecord::Migration

  def self.add_shorts group, shorts
    shorts.each do |s|
      group.modules << Studmodule.find(:first, :conditions => "short = '#{s}'")
    end
  end

  def self.up
#    g = Group.create :name => "Pflichtmodule"
#    shorts = ["B.Phy.101", "B.Phy.102", "B.Phy.103", "B.Phy.104",
#      "B.Phy.201", "B.Phy.202", "B.Phy.203", "B.Phy.410",
#      "B.Phy.402", "B.Phy.303", "B.Phy.304", "B.Mat.011", "B.Mat.012"
#    ]
#    add_shorts g, shorts

    g = Group.create :name => "Grundkurse"
    shorts = [
      "B.Phy.101", "B.Phy.102", "B.Phy.103", "B.Phy.104",
      "B.Phy.201", "B.Phy.202", "B.Phy.203"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Praktika"
    shorts = [
      "B.Phy.410", "B.Phy.402"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Mathematik"
    shorts = [
      "B.Phy.303", "B.Phy.304", "B.Mat.011", "B.Mat.012"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Spezialisierungspraktikum"
    shorts = [
      "B.Phy.403", "B.Phy.404", "B.Phy.405", "B.Phy.406",
      "B.Phy.407", "B.Phy.408"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Einführungen"
    shorts = [
      "B.Phy.501", "B.Phy.502", "B.Phy.503", "B.Phy.504",
      "B.Phy.510", "B.Phy.511"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Spezielle Themen"
    shorts = [
      "B.Phy.551", "B.Phy.552", "B.Phy.553", "B.Phy.554",
      "B.Phy.561", "B.Phy.562", "B.Phy.563", "B.Phy.564",
      "B.Phy.571", "B.Phy.572", "B.Phy.573", "B.Phy.574",
      "B.Phy.581", "B.Phy.582", "B.Phy.583", "B.Phy.584",
      "B.Phy.591", "B.Phy.592", "B.Phy.593", "B.Phy.594"
    ]
    add_shorts g, shorts

    g = Group.create :name => "MathNat"
    shorts = [
      "B.Phy.606", "B.Bio.118", "B.Bio.112", "B.Che.9105",
      "B.Che.9106", "B.Che.9108", "B.Che.1302.1", "B.Che.2301",
      "B.Che.1401", "B.Geo.402"
    ]
    add_shorts g, shorts

    g = Group.create :name => "NichtPhysikalisch"
    shorts = [
      "B.Bwl.02", "B.Bio.118", "B.Bio.112", "B.Che.9105",
      "B.Che.9106", "B.Che.9108", "B.Che.1302.1", "B.Che.2301",
      "B.Che.1401", "B.Geo.402", "B.OPH.07", "B.Bwl.04",
      "B.Win.01", "B.Win.04", "B.Win.23"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Nano1"
    shorts = [
      "B.Phy.503", "B.Phy.403"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Nano2"
    shorts = [
      "B.Phy.571", "B.Phy.572", "B.Phy.573", "B.Phy.574"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Nano3"
    shorts = [
      "B.Bwl.02", "B.OPH.07", "B.Bwl.04"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Inf1"
    shorts = [
      "B.Phy.510", "B.Phy.511", "B.Phy.404"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Inf2"
    shorts = [
      "B.Win.01", "B.Win.04", "B.Win.23"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Astro1"
    shorts = [
      "B.Phy.501", "B.Phy.405"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Astro2"
    shorts = [
      "B.Phy.551", "B.Phy.552", "B.Phy.553", "B.Phy.554"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Astro3"
    shorts = [
      "B.Phy.502", "B.Phy.504"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Bio1"
    shorts = [
      "B.Phy.502", "B.Phy.406"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Bio2"
    shorts = [
      "B.Phy.561", "B.Phy.562", "B.Phy.563", "B.Phy.564"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Bio3"
    shorts = [
      "B.Phy.501", "B.Phy.503"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Mat1"
    shorts = [
      "B.Phy.503", "B.Phy.407"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Mat2"
    shorts = [
      "B.Phy.571", "B.Phy.572", "B.Phy.573", "B.Phy.574"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Mat3"
    shorts = [
      "B.Phy.502", "B.Phy.504"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Kern1"
    shorts = [
      "B.Phy.504", "B.Phy.408"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Kern2"
    shorts = [
      "B.Phy.581", "B.Phy.582", "B.Phy.583", "B.Phy.584"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Kern3"
    shorts = [
      "B.Phy.501", "B.Phy.503"
    ]
    add_shorts g, shorts

    g = Group.create :name => "Schlüsselkompetenzen"
    shorts = [
      "B.Phy.602", "B.Phy.604", "B.Phy.605"
    ]
    add_shorts g, shorts

  end

  def self.down
  end
end
