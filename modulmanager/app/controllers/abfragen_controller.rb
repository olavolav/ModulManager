# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class AbfragenController < ApplicationController

  helper :all # just make sure to include all helpers

  def ueberblick
    selection = current_selection
    @errors = get_errors selection
    @super_rules = Connection.find(:all,
      :conditions => "parent_id IS NULL AND focus = 0 AND version_id = '#{selection.version.id}'")
    unless selection.focus == nil
      @focus_rules = Connection.find(:first,
        :conditions => "name = '#{selection.focus.name}' AND version_id = '#{selection.version.id}'")
    end
    @is_odd_line = true
    respond_to do |format|
      format.html { render :action => "ueberblick", :layout => false }
    end
  end

  private

  def get_errors selection
    errors = Array.new
    selection.semesters.each do |semester|
      if semester.count > 0
        count = semester.count
        semester.modules.each do |mod|
          if mod.moduledata.permission == nil || mod.permission_removed
            permission = 1
          else
            permission = mod.moduledata.permission.evaluate(selection.semesters, count)
          end
          errors.push mod.moduledata unless permission == 1
        end
      else
        semester.modules.each do |mod|
          errors.push mod.moduledata
        end
      end
    end
    return errors
  end

  public
  
  def submit_AJAX_warning_to_log
    text = params[:text]
    logger.warn "AJAX warning recorded: "+text
    render :text => "Frontend AJAX warning recorded..."
  end

  def auswahl
    @selection = current_selection
    respond_to do |format|
      format.xml { render :action => "auswahl", :layout => false }
    end
  end

  def pool
    selection = current_selection
    @root = Category.find(:first, :conditions => "category_id IS null AND version_id = #{selection.version.id}")
    @schwerpunkte = Focus.find(:all, :conditions => "version_id = #{selection.version.id}")
    respond_to do |format|
      format.xml { render :action => "pool", :layout => false }
    end
  end

  def errors
    selection = current_selection
    @errors = get_errors selection
    respond_to do |format|
      format.xml { render :action => "errors", :layout => false }
    end
  end

  def get_module_info
    selection = current_selection
    mod = Studmodule.find(params[:module_id])
    m2 = nil
    @categories = Array.new
    @focus = selection.focus
    m2 = selection.selection_modules.find(:first, :conditions => "module_id = #{mod.id}")
    @module = mod
    @id = m2.id
    @credits = m2.credits
    if mod.short.include? "custom"
      @name = m2.name
      @description = "Dies ist ein von Ihnen konfiguriertes Modul."
      @short = "-"
      #      @credits = m2.credits
      @permission = nil
      m2.categories.each {|c| @categories.push c.name}
      @categories.uniq!
      @custom = true
    else
      @name         = m2.moduledata.name
      @description  = m2.moduledata.description
      @short        = m2.moduledata.short
      @univzid      = mod.univzid
      #      m2.credits == nil ? @credits = m2.moduledata.credits : @credits = m2.credits

      @permission = m2.moduledata.permission
      m2.moduledata.categories.each do |category|
        unless category.exclusive == 1 || category.focus != nil
          @categories.push category
        end
      end
    end
    m2.category == nil ? @selected_cat = nil : @selected_cat = m2.category.id
    respond_to do |format|
      format.html {render :file => "abfragen/module_info", :layout => false}
    end
  end

  def get_pool_module_info
    mod = Studmodule.find(params[:module_id])
    @categories = Array.new
    @focus = current_selection.focus
    @module = mod
    if mod.short.include? "custom"
      @name = mod.name
      @description = "Dies ist ein Modul, bei dem Sie die entsprechenden Informationen " +
        "selbst eintragen können. Ziel ist, dass Sie auch Module aus anderen Fakultäten im " +
        "ModulManager darstellen können."
      @short = "-"
      @credits = 0
      @permission = nil
      @custom_credits = nil
      mod.categories.each {|c| @categories.push c}
    else
      @name         = mod.name
      @description  = mod.description
      @short        = mod.short
      @credits      = mod.credits
      @univzid      = mod.univzid

      mod.categories.each do |category|
        unless category.exclusive == 1 || category.focus != nil
          @categories.push category
        end
      end
    end
    respond_to do |format|
      format.html {render :file => "abfragen/module_info", :layout => false}
    end
  end

  def add_module_to_selection
    selection       = current_selection
    semester_count  = params[:sem_count]
    module_id       = params[:mod_id]
    category_id     = extract_category_id(params[:cat_id])
    semester = selection.semesters.find(:first, :conditions => "count = #{semester_count}")
    if semester == nil
      semester = Semester.create(:count => semester_count)
      selection.semesters << semester
      selection.save
    end
    studmodule      = Studmodule.find(module_id)
    selected_module = SelectedModule.create(:moduledata => studmodule)
    unless category_id == nil
      category = Category.find(category_id)
      category.focus == nil ? selected_module.category = category : selected_module.category = selected_module.moduledata.categories[0]
    end
    selected_module.save
    semester.modules << selected_module
    render :text => "Module added successfully..."
  end

  def add_custom_module_to_selection
    selection = current_selection
    my_module = nil
    unless semester = selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
      semester = Semester.create(:count => params[:sem_count])
      selection.semesters << semester
    end
    studmodule = Studmodule.find(params[:mod_id])
#    my_module = CustomModule.find(:first, :conditions => "short = '#{studmodule.short}' AND version_id = #{selection.version.id}")
    my_module = CustomModule.find(:first, :conditions => "short = '#{studmodule.short}'")
    if my_module == nil
      my_module = CustomModule.create(
        :moduledata => studmodule,
        :short      => studmodule.short,
        :credits    => params[:credits],
        :name       => params[:name]
      )
    else
      my_module.credits = params[:credits]
      my_module.name    = params[:name]
    end
    params[:has_grade] == nil ? my_module.has_grade = true : my_module.has_grade = params[:has_grade]
    semester.modules << my_module
    semester.save
    cat_id    = params[:cat_id]
    cat_array = cat_id.split(",")
    cat_array.each do |category_id|
      category_id.strip!
      my_module.categories << Category.find(category_id)
    end
    my_module.save
    @m = my_module
    respond_to do |format|
      format.xml { render :action => "add_custom_module_to_selection", :layout => false }
    end
  end

  def change_semester_for_module
    auswahl         = current_selection
    modul           = auswahl.selection_modules.find(:first, :conditions => "module_id = #{params[:mod_id]}")
    new_semester = auswahl.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
    if new_semester == nil
      new_semester = Semester.create :count => params[:sem_count]
      auswahl.semesters << new_semester
      auswahl.save
    end
    modul.semester = new_semester
    modul.save
    render :text => "Module semester changed successfully..."
  end

  def extract_category_id id_string
    id = ""
    found = false
    id_string.each_char do |c|
      if found
        id = "#{id}#{c}"
      else
        found = true if c == "_"
      end
    end
    return nil if id == ""
    return id
  end

  def remove_module_from_selection
    current_selection.selection_modules.each do |m|
      if (m.class == CustomModule && m.id == params[:mod_id]) || (m.module_id.to_i == params[:mod_id].to_i)
        m.categories.each { |category| m.categories.delete category }
        m.destroy
      end
    end
    render :text => "Module removed from selection..."
  end

  def remove_semester_from_selection
    s1 = current_selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
    modules = s1.modules
    modules.each { |m| m.destroy }
    s1.destroy
    render :text => "Semester removed from selection..."
  end

  def remove_grade
    id = params[:mod_id]
    selection = current_selection
    selection.selection_modules.each do |m|
      if m.moduledata.id == id.to_i
        m.has_grade = false
        m.save
        render :text => "success"
        return
      end
    end
    render :text => "error"
  end

  def add_grade
    id = params[:mod_id]
    selection = current_selection
    selection.selection_modules.each do |m|
      if m.moduledata.id == id.to_i
        m.has_grade = true
        m.save
        render :text => "success"
        return
      end
    end
    render :text => "error"
  end

  def save_module_grade

    selection = current_selection
    module_id = params[:mod_id]
    grade = params[:grade]

    selection.semesters.each do |s|
      s.modules.each do |m|
        if m.module_id.to_i == module_id.to_i
          if grade == "" || grade == 0
            m.grade = nil
          else
            m.grade = grade
          end
          m.save
        end
      end
    end

    render :text => "Module grade saved successfully..."

  end

  def note

    @grade = get_note
    respond_to do |format|
      format.html { render :action => "note", :layout => false }
    end

  end

  def info
    selection = current_selection
    id = params[:id]
    @regel = Connection.find(:first, :conditions => "id = '#{id}'")
    @mods = selection.selection_modules
    @errors = get_errors(selection)
    ff = @regel.evaluate @mods, get_errors(selection)
    ff == 1 ? @fullfilled = true : @fullfilled = false
    @credits_earned     = @regel.collected_credits @mods, get_errors(selection)

    @available_modules  = Array.new
    @relevant_modules_in_selection = Array.new

    if @regel.child_connections.length > 0
      @child_rules = @regel.collect_child_rules current_selection
    else
      @relevant_modules_in_selection = @regel.relevant_modules_in_selection(selection)
      modules = @regel.collect_unique_modules_from_children_without_custom
      modules.each do |m|
        found = false
        @mods.each { |mod| found = true if mod.moduledata.id == m.id }
        @available_modules.push m unless found
      end
    end

    respond_to do |format|
      format.html { render :action => "info", :layout => false }
    end

  end

  def change_credits
    credits = params[:credits]
    mod_id = params[:mod_id]
    mod = current_selection.selection_modules.find(:first, :conditions => "module_id = #{mod_id}")
    if mod.moduledata.credits == credits || credits == "false"
      new_credits = nil
    else
      new_credits = credits
    end
    if mod.set_credits_to new_credits
      mod.save
      render :text => "success" and return
    else
      render :text => "failed" and return
    end
  end

  def remove_warning
    mod_id = params[:mod_id]
    selection = current_selection

    selection.selection_modules.each do |m|
      if m.moduledata.id == mod_id.to_i
        m.permission_removed = true
        m.save
        render :text => "success"
        return
      end
    end
    render :text => "error"
  end

  def add_warning
    mod_id = params[:mod_id]
    selection = current_selection

    selection.selection_modules.each do |m|
      if m.moduledata.id == mod_id.to_i
        m.permission_removed = false
        m.save
        render :text => "success"
        return
      end
    end
    render :text => "error"
  end
end
