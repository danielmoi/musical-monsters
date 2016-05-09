class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new user_params

    if @user.save
      session[:user_id] = @user.id
      redirect_to @user
    else
      puts @user.errors
      render 'new'
    end
  end

  def show
    @user = User.find params[:id]
  end

  def edit
    # @user = @current_user #User.find(params[:id])
    @user = User.find params[:id]
  end

  private
  def user_params
    params.require(:user).permit(:name, :country, :city, :bio, :email, :password, :password_confirmation, :image_url)
  end

end
