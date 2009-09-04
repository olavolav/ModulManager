class AbfragenController < ApplicationController

  def test_add
    redirect_to :action => "add_module_to_selection", :sem_count => 1, :mod_id => 3
  end

  def test_remove
    redirect_to :action => "remove_module_from_selection", :mod_id => 12
  end
  
  def ueberblick
    @errors = check_rules
  end

  # Die Auswahl stellt den Hauptbereich der Arbeitsfläche dar und nimmt die
  # Module auf. Hierhin können neue Module gezogen werden sowie alte ent-
  # fernt.
  def auswahl
    @selection = current_selection
    respond_to do |format|
      format.xml
    end
  end

  # Die Action Pool liefert eine XML-Response mit einer Baumartig untergliederten
  # Liste der Module sowie die Schwerpunkte mit den von ihnen abhängigen Modulen.
  def pool
    @root = Category.find(:first, :conditions => "category_id IS null")
    @schwerpunkte = Focus.all
    current_selection
    respond_to do |format|
      format.xml
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
    session[:selection_id] ||= ModuleSelection.create.id
    ModuleSelection.find session[:selection_id]
  end

  def check_rules
    errors = Array.new
    selection = current_selection
    mr = ModuleRule.all
    cr = CreditRule.all

    cr.each do |r|
      case r.relation
      when "min"
        unless sum_credits(r.groups) >= r.count
          errors.push Error.new :rule_id => 1,
            :rule_name => "Regel 1",
            :description => "Zu wenig Credits..."
          # errors.push "Fehler! (Zu wenig Credits)"
        end
      when "max"
        unless sum_credits(r.groups) <= r.count
          errors.push Error.new :rule_id => 2,
            :rule_name => "Regel 2",
            :description => "Zu viele Credits..."
          # errors.push "Fehler! (Zu viele Credits)"
        end
      end
    end

    mr.each do |r|
      case r.relation
      when "min"
        unless sum_modules(r.groups) >= r.count
          errors.push Error.new :rule_id => 3,
            :rule_name => "Regel 3",
            :description => "Zu wenig Module..."
          # errors.push "Fehler! (Zu wenig Module)"
        end
      when "max"
        unless sum_modules(r.groups) < r.count
          errors.push Error.new :rule_id => 4,
            :rule_name => "Regel 4",
            :description => "Zu viele Module..."
          # errors.push "Fehler! (Zu viele Module)"
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

end
