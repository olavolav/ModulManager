class AbfragenController < ApplicationController

  # Überblick über alle Rgeln und deren Erfüllung. Darstellung orientiert sich
  # an der Darstellung des Pools.
  def ueberblick
    @errors = check_rules
    respond_to do |format|
      format.xml { render :action => "ueberblick", :layout => false }
    end
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
    render :action => "ueberblick", :layout => false
  end

  # Die Methode muss mit dem HTTP-Parameter "mod_id" aufgerufen werden. Die
  # Methode veranlasst dann eine Löschung des entsprechenden Moduls aus der
  # Auswahl.
  def remove_module_from_selection
    SelectedModule.find(params[:mod_id]).delete
    render :action => "ueberblick", :layout => false
  end

  # Entfernt ein Semester aus der aktuellen Auswahl. Dieses 
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

  # Erstellt eine neue Standardauswahl
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

  # Diese Methode liefert ein Array mit den Fehlern aus der Überpfürung der Regeln
  # im Zusammenhang mit der aktuellen Auswahl an Modulen zurück
  def check_rules
    # Container für die auszugebenden Fehlermeldungen
    errors = Array.new
    # Alle Regeln, die mit der Anzahl der Module zu tun haben
    mr = ModuleRule.all
    # Alle Regeln, die mit der Anzahl der Credits zu tun haben
    cr = CreditRule.all

    # Jede Regel mit Bezug zu Credits muss gecheckt werden
    cr.each do |r|
      # Die Summe der Credits in den relevanten Gruppen in der aktuellen Auswahl
      credits = sum_credits(r.categories)
      # Auswahl, ob es sich um einen Minimal- oder Maximalwert handelt
      case r.relation
      # Minimalwert
      when "min"
        # Wenn die Credits nicht mindestens die geforderte Anzahl erreichen...
        unless credits >= r.count
          # ...wird ein neuer Fehler hinzugefügt.
          errors.push Error.new :rule_id => 1,
            #:rule_name => "Regel #{r.id}",
            :description => "Zu wenig Credits im Bereich \"#{r.name}\" (#{credits} von #{r.count}).",
            :less => (r.count - credits),
            :rule => r
        end
      # Maximalwert
      when "max"
        # Wenn die Credits nicht maximal die geforderte Anzahl sind...
        unless credits <= r.count
          # ...wird ein Fehler hinzugefügt.
          errors.push Error.new :rule_id => 2,
            #:rule_name => "Regel #{r.id}",
            :description => "Zu viele Credits im Bereich \"#{r.name}\" (#{credits} von #{r.count}).",
            :less => (credits - r.count),
            :rule => r
        end
      end
    end

    # Es werden alle modulbezogenen Regeln durchlaufen
    mr.each do |r|
      # Die Summe der Anzahl der Module in der aktuellen Auswahl, die für die
      # gerade zu prüfende Regel relevant sind
      mods = sum_modules(r.categories)
      # Auswahl, ob es sich um eine Minimal- oder Maximal-Anforderung handelt
      case r.relation
      # Minimalwert
      when "min"
        # Wenn die Anzahl der Module die geforderte Zahl nicht übersteigt...
        unless mods >= r.count
          # ...wird ein Fehler hinzugefügt
          errors.push Error.new :rule_id => 3,
            #:rule_name => "Regel #{r.id}",
            :description => "Zu wenig Module im Bereich \"#{r.name}\" (#{mods} von #{r.count}).",
            :less => (r.count - mods),
            :rule => r
        end
      # Maximalwert
      when "max"
        # Wenn die Anzahl der Module die geforderte Höchstzahl nicht unterbietet...
        unless mods < r.count
          # ...wird ein Fehler hinzugefügt
          errors.push Error.new :rule_id => 4,
            #:rule_name => "Regel #{r.id}",
            :description => "Zu viele Module im Bereich \"#{r.name}\" (#{mods} von #{r.count})",
            :less => (mods - r.count),
            :rule => r
        end
      end
    end

    # Ein Array mit den Fehlern wird zurückgeliefert
    return errors
  end

  # Errechnet die Summe der Credits in den ausgewählten Modulen und den über-
  # gebenen Gruppen.
  def sum_credits categories
    # Container für die relevanten Module
    modules = select_relevant_modules categories
    sum = 0
    # Alle relevanten Module werden durchlaufen
    modules.each do |m|
      # Die Credits des aktuellen Moduls werden zur Gesamtzahl der Credits
      # hinzugezählt
      sum += m.credits
    end
    # Liefert die Summe zurück
    return sum
  end

  # Errechnet die Anzahl der Module in der aktuellen Auswahl und den übergebenen
  # Gruppen.
  def sum_modules categories
    modules = select_relevant_modules categories
    return modules.length
  end

  # Liefert die für die übergebene Gruppenmenge relevanten Module der aktuellen
  # Auswahl als Array zurück.
  def select_relevant_modules categories
    modules = Array.new
    # Alle Module der aktuellen Auswahl werden durchlaufen
    current_selection.modules.each do |m|
      # Alle Gruppen des aktuellen Moduls werden durchlaufen
      m.categories.each do |g1|
        # Alle übergebenen Gruppen werden durchlaufen
        categories.each do |g2|
          # Sollte eine der übergebenen Gruppen mit einer Gruppe des
          # aktuellen Moduls übereinstimmen, so wird dieses in den Container
          # gelegt.
          modules.push m if g1.id == g2.id
        end
      end
    end
    return modules
  end

end
