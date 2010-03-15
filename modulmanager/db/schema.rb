# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100304231518) do

  create_table "categories", :force => true do |t|
    t.string   "name"
    t.integer  "category_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "description"
    t.integer  "version_id"
    t.string   "modus"
    t.boolean  "visible"
    t.integer  "focus_id"
    t.integer  "credits"
    t.integer  "count"
    t.integer  "grade_remove", :default => 0
    t.integer  "exclusive",    :default => 0
    t.integer  "position"
  end

  create_table "categories_selected_modules", :id => false, :force => true do |t|
    t.integer "category_id"
    t.integer "selected_module_id"
  end

  create_table "categories_studmodules", :id => false, :force => true do |t|
    t.integer "category_id"
    t.integer "studmodule_id"
  end

  create_table "connections", :force => true do |t|
    t.integer  "parent_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "type"
    t.string   "name"
    t.integer  "focus"
    t.integer  "version_id"
    t.integer  "owner_id"
    t.text     "description"
    t.integer  "position"
  end

  create_table "errors", :force => true do |t|
    t.integer  "rule_id"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "less"
  end

  create_table "foci_pflicht", :id => false, :force => true do |t|
    t.integer "focus_id"
    t.integer "studmodule_id"
  end

  create_table "foci_profil", :id => false, :force => true do |t|
    t.integer "focus_id"
    t.integer "studmodule_id"
  end

  create_table "foci_studmodules", :id => false, :force => true do |t|
    t.integer "focus_id"
    t.integer "studmodule_id"
  end

  create_table "foci_themes", :id => false, :force => true do |t|
    t.integer "focus_id"
    t.integer "studmodule_id"
  end

  create_table "focus", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "description"
    t.integer  "version_id"
  end

  create_table "groups_studmodules", :id => false, :force => true do |t|
    t.integer "group_id"
    t.integer "studmodule_id"
  end

  create_table "module_selections", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "focus_id"
    t.integer  "version_id"
  end

  create_table "rules", :force => true do |t|
    t.string   "name"
    t.integer  "count"
    t.string   "relation"
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "category_id"
    t.text     "description"
    t.integer  "parent_id"
    t.integer  "condition_id"
  end

  create_table "rules_studmodules", :id => false, :force => true do |t|
    t.integer "rule_id"
    t.integer "studmodule_id"
  end

  create_table "selected_modules", :force => true do |t|
    t.integer  "module_id"
    t.integer  "semester_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "grade"
    t.string   "type"
    t.string   "name"
    t.integer  "credits"
    t.string   "short"
    t.integer  "parent_id"
    t.integer  "category_id"
    t.boolean  "permission_removed"
    t.boolean  "has_grade",          :default => true
  end

  create_table "semesters", :force => true do |t|
    t.integer  "selection_id"
    t.integer  "count"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "studmodules", :force => true do |t|
    t.string   "name"
    t.integer  "credits"
    t.string   "short"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "randomness"
    t.string   "type"
    t.integer  "parts"
    t.integer  "version_id"
    t.integer  "parent_id"
    t.string   "subname"
    t.boolean  "has_grade"
    t.string   "univzid"
  end

  create_table "versions", :force => true do |t|
    t.string   "name"
    t.string   "short"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.date     "date"
    t.string   "path"
  end

end
