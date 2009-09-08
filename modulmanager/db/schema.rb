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

ActiveRecord::Schema.define(:version => 20090908083121) do

  create_table "categories", :force => true do |t|
    t.string   "name"
    t.integer  "category_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "errors", :force => true do |t|
    t.integer  "rule_id"
    t.string   "rule_name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "less"
  end

  create_table "foci_studmodules", :id => false, :force => true do |t|
    t.integer "focus_id"
    t.integer "studmodule_id"
  end

  create_table "focus", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups_rules", :id => false, :force => true do |t|
    t.integer "group_id"
    t.integer "rule_id"
  end

  create_table "groups_studmodules", :id => false, :force => true do |t|
    t.integer "group_id"
    t.integer "studmodule_id"
  end

  create_table "module_selections", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "focus_id"
  end

  create_table "rules", :force => true do |t|
    t.string   "name"
    t.integer  "count"
    t.string   "relation"
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "category_id"
  end

  create_table "selected_modules", :force => true do |t|
    t.integer  "module_id"
    t.integer  "semester_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "semesters", :force => true do |t|
    t.integer  "selection_id"
    t.integer  "count"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "semesters_studmodules", :id => false, :force => true do |t|
    t.integer "semester_id"
    t.integer "studmodule_id"
  end

  create_table "studmodules", :force => true do |t|
    t.string   "name"
    t.integer  "credits"
    t.string   "short"
    t.text     "description"
    t.integer  "category_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
