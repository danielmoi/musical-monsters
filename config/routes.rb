Rails.application.routes.draw do



  root :to => 'pages#home'

  resources :users, :only => [:new, :create, :index, :update, :show, :edit]
  # get '/users/edit' => 'users#edit'

  get '/signup' => 'users#new'

  get '/login' => 'session#new'
  post 'login' => 'session#create'


  get 'dance-2d' => 'pages#dance-2d'
  get 'play' => 'pages#play'
  get 'sounds-3d' => 'pages#sounds-3d'
  get 'instrument' => 'pages#instrument'


end
