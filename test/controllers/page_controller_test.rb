require 'test_helper'

class PageControllerTest < ActionController::TestCase
  test "index should render index success" do
    get :index
    assert_response :success
  end
end
