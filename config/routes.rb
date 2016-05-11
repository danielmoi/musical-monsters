Rails.application.routes.draw do



  root :to => 'pages#home'

  get '/users/edit' => 'users#edit'
  resources :users, :only => [:new, :create, :index, :update, :show]

  get '/signup' => 'users#new'

  get '/login' => 'session#new'
  post 'login' => 'session#create'

  delete '/logout' => 'session#destroy'



  get 'dance' => 'pages#dance'
  get 'dj' => 'pages#dj'
  get 'drums' => 'pages#drums'
  get 'sounds-3d' => 'pages#sounds-3d'
  get 'piano' => 'pages#piano'
  get 'blob' => 'pages#blob'


end
