class Category < ActiveRecord::Base
  belongs_to :category, { :foreign_key => "category_id" }
  has_many :categories, { :foreign_key => "category_id" }
  has_many :studmodules, { :foreign_key => "category_id" }
end
