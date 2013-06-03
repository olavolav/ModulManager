require 'test_helper'
require 'performance_test_help'

# Profiling results for each test method are written to tmp/performance.
class BrowsingTest < ActionController::PerformanceTest
  def test_startup
    get '/'
  end

  def test_main_page
    get '/main'
  end

end
