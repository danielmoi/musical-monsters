Rails.application.routes.draw do



  root :to => 'pages#home'

  get '/users/edit' => 'users#edit'
  resources :users, :only => [:new, :create, :index, :update, :show]

  get '/signup' => 'users#new'

  get '/login' => 'session#new'
  post 'login' => 'session#create'

  delete '/logout' => 'session#destroy'



  get 'dance-2d' => 'pages#dance-2d'
  get 'dj' => 'pages#dj'
  get 'play' => 'pages#play'
  get 'sounds-3d' => 'pages#sounds-3d'
  get 'instrument' => 'pages#instrument'


end
