class FillFocusStudmodules < ActiveRecord::Migration
  def self.up
    f = Focus.find(:first, :conditions => "name = 'Nanostrukturphysik'")
    shorts = [
      'B.Phy.503', 'B.Phy.403',
      'B.Phy.571', 'B.Phy.572',
      'B.Phy.573', 'B.Phy.574',
      'B.Bwl.02', 'B.OPH.07',
      'B.Bwl.04'
      ]
    shorts.each do |s|
      f.modules << Studmodule.find(:first, :conditions => "short = '#{s}'")
    end
    f.save

    f = Focus.find(:first, :conditions => "name = 'Physikinformatik'")
    shorts = [
      'B.Phy.510', 'B.Phy.511',
      'B.Phy.404', 'B.Win.01',
      'B.Win.04', 'B.Win.23'
    ]
    shorts.each do |s|
      f.modules << Studmodule.find(:first, :conditions => "short = '#{s}'")
    end
    f.save

    f = Focus.find(:first, :conditions => "name = 'Astro- und Geophysik'")
    shorts = [
      'B.Phy.501', 'B.Phy.405',
      'B.Phy.551', 'B.Phy.552',
      'B.Phy.553', 'B.Phy.554',
      'B.Phy.502', 'B.Phy.504'
    ]
    shorts.each do |s|
      f.modules << Studmodule.find(:first, :conditions => "short = '#{s}'")
    end
    f.save

    f = Focus.find(:first, :conditions => "name = 'Biophysik und Physik komplexer Systeme'")
    shorts = [
      'B.Phy.502', 'B.Phy.406',
      'B.Phy.561', 'B.Phy.562',
      'B.Phy.563', 'B.Phy.564',
      'B.Phy.501', 'B.Phy.503'
    ]
    shorts.each do |s|
      f.modules << Studmodule.find(:first, :conditions => "short = '#{s}'")
    end

    f.save

    f = Focus.find(:first, :conditions => "name = 'Festk&ouml;rper- und Materialphysik'")
    shorts = [
      'B.Phy.503', 'B.Phy.407',
      'B.Phy.571', 'B.Phy.572',
      'B.Phy.573', 'B.Phy.574',
      'B.Phy.502', 'B.Phy.504'
      ]
    shorts.each do |s|
      f.modules << Studmodule.find(:first, :conditions => "short = '#{s}'")
    end
    f.save

    f = Focus.find(:first, :conditions => "name = 'Kern- und Teilchenphysik'")
    shorts = [
      'B.Phy.504', 'B.Phy.408',
      'B.Phy.581', 'B.Phy.582',
      'B.Phy.583', 'B.Phy.584',
      'B.Phy.501', 'B.Phy.503'
      ]
    shorts.each do |s|
      f.modules << Studmodule.find(:first, :conditions => "short = '#{s}'")
    end
    f.save
  end

  def self.down
    f = Focus.all
    f.each do |g|
      g.modules.each do |h|
        g.modules.delete h
      end
    end
  end
end
