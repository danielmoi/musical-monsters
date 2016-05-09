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
    @user = @current_user
  end

  def edit
    @user = @current_user

  end

  def update
    @user = @current_user
    if @user.update user_params
      # if user_params[:image_url]
      #   req = Cloudinary::Uploader.upload user_params[:image_url]
      #   @user.image_url = req["url"]
      # end

      @user.save
      redirect_to user_path(@user)
    else
      # redirect_to user_path(@user)
      render 'edit'
    end
  end


  private
  def user_params
    params.require(:user).permit(:name, :country, :city, :bio, :email, :password, :password_confirmation, :image_url)
  end

end
