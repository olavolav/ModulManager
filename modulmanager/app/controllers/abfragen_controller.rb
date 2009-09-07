class AbfragenController < ApplicationController

  def ueberblick
    @errors = check_rules
    respond_to do |format|
      format.xml { render :action => "ueberblick", :layout => false }
    end
  end

  def ueberblick_new
    
  end

  # Die Auswahl stellt den Hauptbereich der Arbeitsfläche dar und nimmt die
  # Module auf. Hierhin können neue Module gezogen werden sowie alte ent-
  # fernt.
  def auswahl
    @selection = current_selection
    respond_to do |format|
      format.xml { render :action => "auswahl", :layout => false }
    end
  end

  # Die Action Pool liefert eine XML-Response mit einer Baumartig untergliederten
  # Liste der Module sowie die Schwerpunkte mit den von ihnen abhängigen Modulen.
  def pool
    @root = Category.find(:first, :conditions => "category_id IS null")
    @schwerpunkte = Focus.all
    current_selection
    respond_to do |format|
      format.xml { render :action => "pool", :layout => false }
    end
  end

  # Die Methode muss mit den HTTP-Parametern "sem_count", für das Semester, in
  # das hinzugefügt werden soll, und "mod_id" für die ID des hinzugefügten
  # Modules aufgerufen werden. Die Methode speichert dann das übergebene Modul
  # im entsprechenden Semester der Auswahl.
  def add_module_to_selection
    # Aktuelle zur Session passende Auswahl laden
    selection = current_selection
    # Entweder das passende Semester in der Auswahl finden...
    unless semester = selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
      # ...oder ein neues mit der entsprechenden Zahl erstellen
      semester = Semester.create(:count => params[:sem_count])
      # und in der Auswahl speichern
      selection.semesters << semester
    end
    # Zum passenden Semester das ausgewählte Modul hinzufügen
    semester.modules << SelectedModule.create(:moduledata => Studmodule.find(params[:mod_id]))
    # Umleitung zur Liste der aktuell ausgewählten Module
    redirect_to :action => "ueberblick"
  end

  # Die Methode muss mit dem HTTP-Parameter "mod_id" aufgerufen werden. Die
  # Methode veranlasst dann eine Löschung des entsprechenden Moduls aus der
  # Auswahl.
  def remove_module_from_selection
    SelectedModule.find(params[:mod_id]).delete
    redirect_to :action => "ueberblick"
  end

  def remove_semester_from_selection
    Semester.find(
      :first,
      :conditions => "selection_id = #{current_selection.id} AND count = #{params[:sem_count]}").delete
    redirect_to :action => "ueberblick"
  end

  private

  # Diese Hilfsmethode liefert die ID der aktuellen Auswahl aus dem Session-
  # Cookie.
  def current_selection
    session[:selection_id] ||= new_selection
    ModuleSelection.find session[:selection_id]
  end

  def new_selection(focus = nil)
    ms = ModuleSelection.create
    s1 = Semester.create :count => 1
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.101'")
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.605'")
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Mat.011'")
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Mat.012'")
    ms.semesters << s1
    s2 = Semester.create :count => 2
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.102'")
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.410'")
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.303'")
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.605'")
    ms.semesters << s2
    s3 = Semester.create :count => 3
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.103'")
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.410'")
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.304'")
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.201'")
    ms.semesters << s3
    s4 = Semester.create :count => 4
    s4.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.104'")
    s4.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.604'")
    s4.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.202'")
    ms.semesters << s4
    s5 = Semester.create :count => 5
    s5.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.402'")
    s5.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.203'")
    ms.semesters << s5
    s6 = Semester.create :count => 6
    s6.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.602'")
    ms.semesters << s6
    return ms.id
  end

  def check_rules
    errors = Array.new
    mr = ModuleRule.all
    cr = CreditRule.all

    cr.each do |r|
      credits = sum_credits(r.groups)
      case r.relation
      when "min"
        
        unless credits >= r.count
          errors.push Error.new :rule_id => 1,
            :rule_name => "Regel #{r.id}",
            :description => "Zu wenig Credits im Bereich \"#{r.name}\" (#{credits} von #{r.count}).",
            :less => (r.count - credits)
        end
      when "max"
        unless credits <= r.count
          errors.push Error.new :rule_id => 2,
            :rule_name => "Regel #{r.id}",
            :description => "Zu viele Credits im Bereich \"#{r.name}\" (#{credits} von #{r.count}).",
            :less => (credits - r.count)
        end
      end
    end

    mr.each do |r|
      mods = sum_modules(r.groups)
      case r.relation
      when "min"
        unless mods >= r.count
          errors.push Error.new :rule_id => 3,
            :rule_name => "Regel #{r.id}",
            :description => "Zu wenig Module im Bereich \"#{r.name}\" (#{mods} von #{r.count}).",
            :less => (r.count - mods)
        end
      when "max"
        unless mods < r.count
          errors.push Error.new :rule_id => 4,
            :rule_name => "Regel #{r.id}",
            :description => "Zu viele Module im Bereich \"#{r.name}\" (#{mods} von #{r.count})",
            :less => (mods - r.count)
        end
      end
    end

    return errors

  end

  # Errechnet die Summe der Credits in den ausgewählten Modulen und den über-
  # gebenen Gruppen.
  def sum_credits groups
    modules = Array.new
    current_selection.modules.each do |m|
      m.groups.each do |g1|
        groups.each do |g2|
          modules.push m if g1.id == g2.id
        end
      end
    end
    sum = 0
    modules.each do |m|
      sum += m.credits
    end
    return sum
  end

  # Errechnet die Anzahl der Module in der aktuellen Auswahl und den übergebenen
  # Gruppen.
  def sum_modules groups
    modules = Array.new
    current_selection.modules.each do |m|
      m.groups.each do |g1|
        groups.each do |g2|
          modules.push m if g1.id == g2.id
        end
      end
    end
    return modules.length
  end

  def check_rules_like_pool

  end

end
